import { userSchema, UserType } from "@/app/lib/userSchema";
import { NextResponse } from "next/server";
import bycrpt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

let users: UserType[] = [];

// Sign in
export async function POST(request: Request) {
	const body = await request.json();
	const validatedResponse = userSchema.safeParse(body);
	if (!validatedResponse.success) {
		return NextResponse.json({ message: "Invalid input" }, { status: 400 });
	}
	const email = validatedResponse.data?.email;
	const password = validatedResponse.data?.password;
	if (!email || !password) {
		return NextResponse.json({ message: "Missing inputs" }, { status: 400 });
	}
	const user = users.find((u) => u.email === email);

	if (user)
		return NextResponse.json({ message: "user already exist. log in instead" }, { status: 409 });

	const saltRounds = 10;
	const hashedPassword = await bycrpt.hash(password, saltRounds);
	const newUser = {
		id: uuidv4(),
		email,
		password: hashedPassword,
	};

	users.push(newUser);
	return NextResponse.json({ message: "User successfully registered" }, { status: 200 });
}
