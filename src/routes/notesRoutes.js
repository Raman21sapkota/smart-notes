import {Router} from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {createNote, getNotes, getNote, updateNote, deleteNote, summarizeNote, restoreNote, pinNote, unpinNote} from "../controllers/notesController.js";
import { validate } from "../middleware/validation.js";
import { createNoteSchema, updateNoteSchema } from "../validation/noteValidation.js";



const router = Router();

router.use(authMiddleware);

router.post("/", validate(createNoteSchema), createNote);
router.get("/", getNotes);
router.get("/:id", getNote);
router.put("/:id", validate(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/summarize", summarizeNote);
router.patch("/:id/restore", restoreNote);
router.patch("/:id/pin", pinNote);
router.patch("/:id/unpin", unpinNote);


export default router;
