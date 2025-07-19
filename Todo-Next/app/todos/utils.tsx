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

export const postRequest = async (
	title: string,
	addTodo: (newTodo: Todo) => void,
	setError: (value: string) => void
) => {
	try {
		const res = await fetch("http://localhost:3000/todos/api", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				completed: false,
			}),
		});

		if (!res.ok) {
			const errorData = await res.json();
			setError(errorData.error || "Failed to add todo");
			return;
		}

		const data = await res.json();
		addTodo(data);
	} catch (error) {
		console.error("Issue adding todo", error);
		setError("Failed to add todo due to network error");
	}
};

export const putRequest = async (
	updateTodo: (id: string, title: string) => void,
	id: string,
	title: string,
	completed?: boolean
) => {
	try {
		const res = await fetch("http://localhost:3000/todos/api", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, title, completed }),
		});

		if (!res.ok) {
			throw new Error("Failed to update todo");
		}

		const data = await res.json();
		updateTodo(id, title);
	} catch (error) {
		console.error("Issue updating todo:", error);
	}
};

export const deleteRequest = async (
	id: string,
	completed: boolean,
	deleteTodo: (id: string) => void
) => {
	try {
		const res = await fetch("http://localhost:3000/todos/api", {
			method: "DELETE",
			headers: { "Content-Type": "/application/json" },
			body: JSON.stringify({
				id,
				completed,
			}),
		});

		if (!res.ok) {
			const errorData = await res.json();
			console.log(errorData.message || "Error fetching Data");
		}

		deleteTodo(id);
	} catch (err) {
		console.error("Issue deleting todo", err);
	}
};
