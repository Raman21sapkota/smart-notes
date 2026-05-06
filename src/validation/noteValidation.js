import { z } from "zod";

export const createNoteSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .trim(),

    content: z.string()
        .min(1, "Content is required")
        .trim(),
});

export const updateNoteSchema = z.object({
    title: z.string()
        .min(1, "Title cannot be empty")
        .trim()
        .optional(),

    content: z.string()
        .min(1, "Content cannot be empty")
        .trim()
        .optional(),
});