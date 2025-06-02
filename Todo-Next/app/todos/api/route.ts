import { NextResponse, NextRequest } from "next/server";
import type { Todo } from "../types";
import { v4 as uuidv4 } from "uuid";

let todos: Todo[] = [
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
	return NextResponse.json(todos, { status: 200 });
}

export async function POST(request: Request) {
	const body = await request.json();
	const { title, completed = false } = body;
	if (!title) {
		return NextResponse.json({ error: "Title is required" }, { status: 400 });
	}

	const newTodo = {
		id: uuidv4(),
		title,
		completed,
	};

	todos.push(newTodo);
	return NextResponse.json(newTodo, { status: 201 });
}

export async function PUT(request: Request) {
	const body = await request.json();
	const { id, title, completed } = body;
	const todo = todos.find((todo) => todo.id === id);

	if (todo) {
		todo.title = title;
		todo.completed = completed;
		return NextResponse.json(todo, { status: 200 });
	} else {
		return NextResponse.json({ error: "Todo not found" }, { status: 404 });
	}
}

export async function DELETE(request: Request) {
	const body = await request.json();
	const { id } = body;
	if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

	const todo = todos.find((todo) => todo.id === id);

	if (!todo?.completed) {
		return NextResponse.json({ error: "Todo must be completed" }, { status: 403 });
	}

	todos = todos.filter((todo) => todo.id !== id);

	return NextResponse.json({ message: "Todo successfully deleted" }, { status: 200 });
}
