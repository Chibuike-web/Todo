"use client";

import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TodoType } from "./lib/todoSchema";

const initialTodos: TodoType[] = [
	{ id: uuidv4(), title: "Go for a walk", completed: false },
	{ id: uuidv4(), title: "Go for a run", completed: false },
	{ id: uuidv4(), title: "Go for breakfast", completed: false },
	{ id: uuidv4(), title: "Go for lunch", completed: false },
];

// 🚀 Component
export default function Home() {
	const [todos, setTodos] = useState<TodoType[]>([]);
	const [input, setInput] = useState("");

	useEffect(() => {
		const storedTodos = localStorage.getItem("todos");
		if (storedTodos) {
			try {
				const parsed = JSON.parse(storedTodos);
				if (Array.isArray(parsed)) {
					setTodos(parsed);
				}
			} catch {
				console.warn("Invalid todos in localStorage");
			}
		} else {
			localStorage.setItem("todos", JSON.stringify(initialTodos));
			setTodos(initialTodos);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
	}, [todos]);

	const handleAddTodo = () => {
		if (input.trim().length === 0) return;

		const newTodo: TodoType = {
			title: input.trim(),
			completed: false,
		};

		setTodos((prev) => [...prev, newTodo]);
		setInput("");
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
