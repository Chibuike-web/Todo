import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { users } from "@/app/api/lib/fakeDB";

export async function POST(request: NextRequest) {
	const { id, title } = await request.json();
	if (!id || !title) {
		return NextResponse.json({ message: "Missing inputs" }, { status: 400 });
	}

	const user = users.find((u) => u.id === id);
	if (!user) {
		return NextResponse.json({ message: "User not found" }, { status: 404 });
	}

	const newTodo = {
		id: uuidv4(),
		title: title,
	};

	if (!user.todos) user.todos = []; // ✅ defensive check
	user.todos.push(newTodo);
	console.log(user);

	return NextResponse.json({ message: "Todo saved", todo: newTodo, user: user }, { status: 200 });
}
