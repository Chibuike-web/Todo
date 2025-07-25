import { z } from "zod";

// 🧠 Schema and types
export const todoSchema = z.object({
	id: z.uuid().optional(),
	title: z.string(),
});

export type TodoType = z.infer<typeof todoSchema>;
