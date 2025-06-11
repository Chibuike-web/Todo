"use client";
import { useState, useEffect } from "react";
import { useTodos } from "./store/useTodosStore";
import { deleteRequest, getRequest, postRequest, putRequest } from "./utils";
import type { Todo } from "./types";
import { useError, useErrorId } from "./store/useErrorStore";

export default function TodoList() {
	const [input, setInput] = useState("");
	const [editInput, setEditInput] = useState("");
	const [edit, setEdit] = useState<string | null>(null);
	const { todos, addTodo, setTodos, updateTodo } = useTodos();
	const { setError } = useError();

	useEffect(() => {
		getRequest(setTodos);
	}, []);

	const handleAddTodo = () => {
		if (!input.trim()) return;
		postRequest(input, addTodo, setError);
		setInput("");
	};

	const handleEdit = (todoId: string, currentTitle: string) => {
		setEdit(todoId);
		setEditInput(currentTitle);
	};

	const handleSave = (todoId?: string) => {
		if (!todoId || !editInput.trim()) return;
		putRequest(updateTodo, todoId, editInput);
		setEditInput("");
		setEdit(null);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4">
				<h1 className="text-2xl font-bold text-center text-black">Todo App</h1>

				{/* Input for new todo */}
				<Input input={input} setInput={setInput} handleTodo={handleAddTodo} />
				{todos.map(({ id, title, completed }: Todo) =>
					edit === id ? (
						<Input
							key={id}
							id={id}
							input={editInput}
							setInput={setEditInput}
							handleTodo={handleSave}
						/>
					) : (
						<TodoItem
							key={id}
							id={id}
							title={title}
							completed={completed}
							handleEdit={handleEdit}
						/>
					)
				)}
			</div>
		</div>
	);
}

type TodoItem = Todo & {
	handleEdit: (value: string, title: string) => void;
};

const TodoItem = ({ id, title, completed, handleEdit }: TodoItem) => {
	const { todos, deleteTodo, setTodos, updateTodo } = useTodos();
	const { errorId, setErrorId } = useErrorId();
	const { error, setError } = useError();

	const handleDelete = (todoId: string, completed: boolean) => {
		if (!completed) {
			setErrorId(todoId);
			setError("The Todo must be completed first");
			return;
		}
		deleteRequest(todoId, completed, deleteTodo);
	};

	const handleCheck = (todoId: string, completed: boolean) => {
		const newTodos = todos.map((todo) =>
			todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
		);
		setTodos(newTodos);
		setError("");
		setErrorId("");
		const todo = todos.find((todo) => todo.id === todoId);
		if (todo) {
			putRequest(updateTodo, todoId, todo.title, completed);
		}
	};

	return (
		<div>
			<div id={`item-${id}`} className="flex items-center justify-between p-3 border rounded-xl">
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						className="w-5 h-5"
						checked={completed}
						onChange={(e) => handleCheck(id, e.target.checked)}
					/>
					<span className={`text-gray-700 ${completed ? "line-through" : ""}`}>{title}</span>
				</div>
				<div className="flex items-center gap-2">
					<button
						disabled={completed}
						className="text-blue-500 hover:text-blue-700 disabled:cursor-none disabled:text-gray-300 cursor-pointer"
						onClick={() => handleEdit(id, title)}
					>
						Edit
					</button>
					<button
						className="text-red-500 hover:text-red-700 cursor-pointer"
						onClick={() => handleDelete(id, completed)}
					>
						Delete
					</button>
				</div>
			</div>
			{errorId === id && <p className="text-sm text-red-600 mt-1 ml-2 animate-pulse">{error}</p>}
		</div>
	);
};

const Input = ({
	id,
	input,
	setInput,
	handleTodo,
}: {
	id?: string;
	input: string;
	setInput: (value: string) => void;
	handleTodo: (id?: string) => void;
}) => {
	const { error, setError } = useError();
	return (
		<div>
			<div className="flex items-center gap-2">
				<input
					type="text"
					placeholder="Add a new todo..."
					value={input}
					className="flex-1 px-4 py-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 text-gray-700 border-gray-100"
					onChange={(e) => setInput(e.target.value)}
					onFocus={() => error && setError("")}
					onKeyDown={(e) => e.key === "Enter" && handleTodo(id)}
				/>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded-[8px] cursor-pointer hover:bg-blue-600"
					onClick={() => handleTodo(id)}
				>
					{id ? "Save" : "Add"}
				</button>
			</div>
			{error && <p className="text-sm text-red-600 mt-1 ml-1 animate-pulse">{error}</p>}
		</div>
	);
};
