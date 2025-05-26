import type { Todo } from "./types";

export const getRequest = async (setTodos: (newTodos: Todo[]) => void) => {
	try {
		const res = await fetch("http://localhost:3000/todos/api");
		if (!res.ok) {
			throw new Error("Failed to fetch todos");
		}
		const data = await res.json();
		setTodos(data);
	} catch (error) {
		console.log("Issue fetching data: " + error);
		return [];
	}
};

export const postRequest = async (title: string, addTodo: (newTodo: Todo) => void) => {
	try {
		const res = await fetch("http://localhost:3000/todos/api", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				completed: false,
			}),
		});
		const data = await res.json();

		if (!res.ok) {
			throw new Error("Failed to add todo");
		}
		addTodo(data);
	} catch (error) {
		console.error("Issue adding todo", error);
	}
};
