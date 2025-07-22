import { NextResponse } from "next/server";
import { users } from "@/app/api/lib/fakeDB";

// Log in
export async function POST(request: Request) {
	const { email, password } = await request.json();
	if (!email || !password) {
		return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
	}
	const user = users.find((u) => u.email === email);
	console.log(user);

	if (!user)
		return NextResponse.json({ message: "user doesn't exist. sign up instead" }, { status: 409 });

	return NextResponse.json(
		{ message: "User successfully authenticated", user: user },
		{ status: 200 }
	);
}
