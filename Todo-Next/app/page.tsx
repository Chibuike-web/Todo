"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TodoType } from "./lib/todoSchema";
import { useRouter } from "next/navigation";
import { UserType } from "./lib/userSchema";

export default function Home() {
	const [todos, setTodos] = useState<TodoType[]>([]);
	const [input, setInput] = useState("");
	const [user, setUser] = useState<UserType | null>(null);

	const router = useRouter();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const storedTodos = localStorage.getItem("todos");

		if (!storedUser) {
			router.push("/signup");
			return;
		}
		if (!storedTodos) return;

		const parsedUser = JSON.parse(storedUser);
		if (!parsedUser) return;
		setUser(parsedUser);

		try {
			const parsed = JSON.parse(storedTodos);
			if (Array.isArray(parsed)) {
				setTodos(parsed);
			}
		} catch {
			console.warn("Invalid todos in localStorage");
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
		localStorage.setItem("user", JSON.stringify(user));
	}, [todos, user]);

	const handleAddTodo = async () => {
		if (input.trim().length === 0) return;

		const title = input.trim();

		try {
			const res = await fetch("/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: user?.id, title: title }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				if (res.status === 400) {
					console.log(errorData.message);
					return;
				}
				return;
			}
			const data = await res.json();
			setTodos((prev) => [...prev, data.todo]);
			setUser(data.user);
			setInput("");
		} catch (err) {}
	};

	return (
		<main className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<section className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
				<div className="flex items-center gap-2 mb-6">
					<Input
						type="text"
						placeholder="Add a todo..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button type="button" onClick={handleAddTodo}>
						Add
					</Button>
				</div>

				<ul className="flex flex-col gap-4 divide-y-1">
					{todos.map((todo) => (
						<li key={todo.id} className="flex items-center justify-between pb-4">
							<span>{todo.title}</span>
							<div className="flex gap-2">
								<Button variant="outline">Edit</Button>
								<Button variant="destructive">Delete</Button>
							</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
