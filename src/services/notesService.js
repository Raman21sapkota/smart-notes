import * as noteRepository from "../repositories/notesRepository.js";
import AppError from "../utils/AppError.js";
import { analyzeContentFromNote } from "./geminiService.js";
import { getCache, setCache, deleteCache, incrementCache } from "./redisService.js";

//a helper function to delete cache when note is updated or deleted
// const deleteNoteCache = async (userId, noteId) => {

//     // user id and note id used to secure cache manipulation, only authenticated user can perform actions
//     const cacheKey = `user:${userId}:note:${noteId}:summary`;

//     try {
//         await redisClient.del(cacheKey);
//         console.log(`Cache deleted for note ${noteId}`);
//     } catch (error) {
//         console.error("redis cache deletion failed:", error.message);
//     }
// };




//how many time gemini call can be made in an hour, this is for managing cost 
const GEMINI_CALL_LIMIT = 5;


//creating a function to create cache key for summary
const createCacheKey = (userId, noteId) => {
    return `user:${userId}:note:${noteId}:summary`;
}

//creating a function to create cache key for gemini call count
const createCallCountCacheKey = (userId) => {
    return `user:${userId}:geminiCallCount`;
}

// Create Note
export const createNote = async (userId, { title, content }) => {
    if (!title || !content) {
        throw new AppError("Title and content are required", 400);
    }

    return noteRepository.createNote({ title, content, userId });
};

// get all notes
export const getUserNotes = async (userId, search, tag, page, sortBy, order) => {
    return await noteRepository.getNotesByUser(userId, search, tag, page, sortBy, order);
};

// get a single note
export const getNote = async (userId, noteId) => {
    const note = await noteRepository.getNoteById(noteId, userId);

    if (!note) {

        throw new AppError("Note not found", 404); 
    }
    return note;
};

// update note
export const updateNote = async (userId, noteId, data) => {
    //note ownership and note existence check
    const note = await getNote(userId, noteId);
    const cacheKey = createCacheKey(userId, noteId);

    const updatedNote = {
        ...data,
        summary: null,
        tags: [],
        actionItems: [],
    };
    const result = await noteRepository.updateNote(noteId, updatedNote);

    await deleteCache(cacheKey); // deleting cache when note is updated
    return result;

};

// delete note
export const deleteNote = async (userId, noteId) => {
    const note = await getNote(userId, noteId);
    const cacheKey = createCacheKey(userId, noteId);

    const deletedNote = await noteRepository.deleteNote(noteId);
    // clearing cache after note deletion
    await deleteCache(cacheKey);
    return deletedNote;

};

/*analyzing note content using Gemini
export const summarizeNote = async (userId, noteId) => {

  const note = await getNote(userId, noteId);

  if (note.summary) {
        console.log("returning existing summary from db");
        return note;
    }

  const geminiResult = await analyzeContentFromNote(note.content);

  const updatedNote = await noteRepository.updateSummaryInNote(
    noteId,
    {
      summary: geminiResult.summary,
      tags: geminiResult.tags,
      actionItems: geminiResult.actionItems,
    }
  );

  return updatedNote;
};
*/

// updated summarizeNote with Redis caching
export const summarizeNote = async (userId, noteId) => {
    //  check ownership + note existence check


    //const note = await getNote(userId, noteId);
    // this code is for re waking redis connection if it goes down
    // if (!redisClient.isOpen) {

    //     redisClient.connect().catch(() => {}); 
    //     console.log("Redis is offline; fetching from DB while attempting background wake-up.");
    // }


    // (1) checking redis first  

    //const cacheKey = `user:${userId}:note:${noteId}:summary`;


    // generating redis cache key
    const cacheKey = createCacheKey(userId, noteId);
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
        console.log("returning data from redis cache");
        return JSON.parse(cachedData);
    }



    // // checking redis first before calling summarize function
    // if (redisClient.isReady) {


    //     try {
    //         const cachedData = await redisClient.get(cacheKey);

    //         if (cachedData) {
    //             console.log("returning data from redis cache");

    //             return JSON.parse(cachedData);
    //         }
    //     } catch (error) {
    //         console.error("redis error:", error.message);
    //     }
    // }
    // console.log("data not found in redis cache");


    // (2)checking if summary already exists in db, it saves the unnecessary geminini call

    const note = await getNote(userId, noteId);


    if (
        note.summary && note.tags?.length > 0) {

        console.log("returning data from db without calling gemini, and also loading cache");

        await setCache(cacheKey, JSON.stringify(note), 86400);

        return note;
    }

    // if (redisClient.isReady) {
    //     try {
    //         await redisClient.set(
    //             cacheKey,
    //             JSON.stringify(note),
    //             {
    //                 EX: 3600,
    //             }
    //         );

    //         console.log(
    //             "data loaded in redis updated from db"
    //         );

    //     } catch (error) {
    //         console.error(
    //             "data loading in redis failed",
    //             error.message
    //         );







    // (3) saving geminiresult in postgreSQL and redis

    console.log(" data also not found in Db, calling gemini and saving result in db and cache");
    //firstly, checking if call limit exceeded
    const callCountCacheKey = createCallCountCacheKey(userId);

    //checking current count of geminii calls
    const currentCallCount = await getCache(callCountCacheKey);

    //checking redis connection
    if (currentCallCount === null) {
        console.warn("Redis is offline; cannot count gemini calls. Proceeding without rate limit check.");
    }

    //checking is user has exceeded gemini summarize limit
    if (currentCallCount !== null && Number(currentCallCount) >= GEMINI_CALL_LIMIT) {
        throw new AppError("Gemini rate limit reached, try again after 1 hour", 429);
    }


    //finally calling gemini
    const geminiResult = await analyzeContentFromNote(note.content);


    // incrementing gemini call count and setting expiry of 1 hour for the count


    await incrementCache(callCountCacheKey, 3600);

    const updatedNote = await noteRepository.updateNote(
        noteId,
        {
            summary: geminiResult.summary,
            tags: geminiResult.tags,

        }
    );

    await setCache(cacheKey, JSON.stringify(updatedNote), 86400);

    return updatedNote;

};

// saving result in redis cache and this function will save data in cache
// if (redisClient.isReady) {
//     try {
//         await redisClient.set(cacheKey,
//             JSON.stringify(updatedNote),
//             {
//                 //this sets the expiry time for exactly 1 hour
//                 EX: 3600,
//             }


//         );
//         console.log("data saved in redis cache after gemini call");
//     }
//     catch (error) {
//         console.error("redis cache saving error:", error.message);
//     }

//restoring note
export const restoreNote = async (userId, noteId) => {
    //note ownership and note existence check
    const note = await noteRepository.getDeletedNoteById(noteId, userId);
    if (!note) {
        throw new AppError("Note not found or not in deleted items", 404);
    }   

    return await noteRepository.restoreNote(noteId);
}

//pinning note

export const pinNote = async (userId, noteId) => {
    // ownership check
    await getNote(userId, noteId); 

    const note = await noteRepository.pinNote(noteId);

    if (!note) {
        throw new AppError("Failed to pin note", 500);
    }

    return note;
};


//pinnig note
export const unpinNote = async (userId, noteId) => {
    await getNote(userId, noteId);  
    
    const note = await noteRepository.unpinNote(noteId);

    if (!note) {
        throw new AppError("Failed to unpin note", 500);
    }

    return note;
};



    
