import { UserType } from "@/app/lib/userSchema";
import { NextResponse } from "next/server";
import bycrpt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

let users: UserType[] = [];

// Log in
export async function POST(request: Request) {
	const { email, password } = await request.json();
	if (!email || !password) {
		return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
	}
	const user = users.find((u) => u.email === email);

	if (!user)
		return NextResponse.json({ message: "user doesn't exist. sign up instead" }, { status: 409 });

	NextResponse.json({ message: "User successfully authenticated", user: user }, { status: 200 });
}
