import * as noteService from "../services/notesService.js";

//create note
export const createNote = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: note,
    });

  } catch (error) {
    next(error);
  }
};

//get all notes

export const getNotes = async (req, res, next) => {
  try {
    const { search, tag, sortBy, order } = req.query;
    //checking if page number valid
    const page = Number(req.query.page) > 0 ? Number(req.query.page): 1;
    const notes = await noteService.getUserNotes(req.user.id, search, tag, page, sortBy, order);


    res.status(200).json({
      success: true,
      data: notes,
      success: true,
      page,
      count: notes.length,
      data: notes,
    });

  } catch (error) {
    next(error);
  }
};

//get single note by id

export const getNote = async (req, res, next) => {
  try {
    const note = await noteService.getNote(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      data: note,
    });

  } catch (error) {
    next(error);
  }
};

//update note

export const updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(
      req.user.id,
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: note,
    });

  } catch (error) {
    next(error);
  }
};

//deletenote
export const deleteNote = async (req, res, next) => {
  try {
    const deletedNote = await noteService.deleteNote(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted",
      isDeleted: deletedNote.isDeleted,
    });

  } catch (error) {
    next(error);
  }
};

//summarizeNote
export const summarizeNote = async (req, res, next) => {
  try {
    const updatedNote = await noteService.summarizeNote(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Note analysis successful",
      data: updatedNote,
    });

  } catch (error) {
    next(error);
  }
};

//restore note

export const restoreNote = async (req, res, next) => {
  try {
    const restoredNote = await noteService.restoreNote(
      req.user.id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Note restored successfully",
      data: restoredNote,
    });

  } catch (error) {
    next(error);
  }
}

//pin note
export const pinNote = async (req, res, next) => {
    try {
        const note = await noteService.pinNote(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: note,
        });

    } catch (error) {
        next(error);
    }
};

//unpin note
export const unpinNote = async (req, res, next) => {
    try {
        const note = await noteService.unpinNote(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: note,
        });

    } catch (error) {
        next(error);
    }
};