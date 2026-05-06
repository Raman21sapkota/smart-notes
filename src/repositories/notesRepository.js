import prisma from "../config/prisma.js";

export const createNote = (data) => {
    return prisma.note.create({ data });
};


//returing all notes of a user in descending order of creation time
//  and also searching the notes through kkeywird and using tags to filter the notes
//export const getNotesByUser = (userId, search, tag) => {
export const getNotesByUser = (userId, search, tag, page, sortBy = "createdAt", order = "desc") => {
    const limit = 6;
    const jump = (page - 1) * limit;
    return prisma.note.findMany({
        where: {
            userId, isDeleted: false,

            // Prisma ignores these if search or tag are null/undefined
            OR: search ? [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ] : undefined,

            tags: tag ? { has: tag } : undefined,
        },

        orderBy: [{ isPinned: "desc" },
        { [sortBy]: order }],
        skip: jump,
        take: limit,
    });
};




// return prisma.note.findMany({//     where: { userId },
//     orderBy: { createdAt: "desc" },
// });


// export const getNoteById = (id) => {
//     return prisma.note.findFirst({
//         where: { id , isDeleted: false},
//     });
// };

export const getNoteById = (noteId, userId) => {
    return prisma.note.findFirst({
        where: {
            id: noteId, userId, isDeleted: false,
        },
    });
};

export const updateNote = (noteId, data) => {
    return prisma.note.update({

        where: { id: noteId },
        data,
    });
};
//implementing soft delete instead of deleting permanently for future recovery
export const deleteNote = (noteId) => {
    return prisma.note.update({
        where: { id: noteId },

        data: {

            isDeleted: true,
            deletedAt: new Date(),
        },
    });
};

//updating summary in the note after getting summary from gemini api

// export const updateSummaryInNote = (noteId, data) => {
//     return prisma.note.update({
//         where: { id: noteId },
//         data,
//     });
// };


//to restore note, setting is deleted to false and deleted time to null
export const restoreNote = (noteId) => {
    return prisma.note.update({
        where: {
            id: noteId,
        },
        data: {
            isDeleted: false,
            deletedAt: null
        },
    });
};

//function called inside restore note that fetches the  deleted note and also handles user verification
export const getDeletedNoteById = (noteId, userId) => {
    return prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
            isDeleted: true,
        },
    });
};

//pinnig notes
export const pinNote = (noteId) => {
    return prisma.note.update({
        where: { id: noteId },
        data: { isPinned: true },
    });
};

//unpining notes

export const unpinNote = (noteId) => {
    return prisma.note.update({
        where: { id: noteId },
        data: { isPinned: false },
    });
};