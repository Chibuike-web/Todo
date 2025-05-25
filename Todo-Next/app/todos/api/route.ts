import { NextResponse } from "next/server";
import type { Todo } from "../types";
import { v4 as uuidv4 } from "uuid";

const initialTodos: Todo[] = [
	{
		id: uuidv4(),
		title: "Buy groceries",
		completed: false,
	},
	{
		id: uuidv4(),
		title: "Finish React project",
		completed: false,
	},
	{
		id: uuidv4(),
		title: "Go for a walk",
		completed: false,
	},
	{
		id: uuidv4(),
		title: "Apply for a Phd",
		completed: false,
	},
];

export async function GET() {
	return NextResponse.json(initialTodos);
}
