import { useState, useEffect } from "react";
import { useTodos } from "./store/store";

export default function Todos() {
	const [input, setInput] = useState("");
	const [editInput, setEditInput] = useState("");
	const [edit, setEdit] = useState(null);

	const { todos, addTodo, editTodo, setTodos } = useTodos();

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const res = await fetch("http://localhost:6565/api/todos");
				const data = await res.json();
				setTodos(data);
			} catch (error) {
				console.error(`Failed to fetch todos: ${error.message}`);
			}
		};

		fetchTodos();
	}, []);

	const postRequest = async (title) => {
		try {
			const res = await fetch("http://localhost:6565/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: title,
					completed: false,
				}),
			});
			const data = await res.json();
			addTodo(data);
		} catch (error) {
			console.error(`Error creating todo: ${error.message}`);
		}
	};

	const putRequest = async (todoId, title, completed) => {
		try {
			const res = await fetch("http://localhost:6565/api/todos", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: todoId,
					title: title,
					completed: completed,
				}),
			});

			const data = await res.json();
			editTodo(data.id, data.title);
		} catch (error) {
			console.error(`Error editing todo with id: ${todoId} - ${error.message}`);
		}
	};

	const handleAddTodo = () => {
		if (input.trim().length === 0) return;
		postRequest(input);
		setInput("");
	};
	const handleEdit = (todoId, currentTitle) => {
		setEdit(todoId);
		setEditInput(currentTitle);
	};
	const handleSave = (todoId) => {
		if (!todoId || editInput.trim().length === 0) return;
		putRequest(todoId, editInput);
		setEditInput("");
		setEdit(null);
	};
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4">
				<h1 className="text-2xl font-bold text-center text-black">Todo App</h1>

				{/* Input for new todo */}
				<Input input={input} setInput={setInput} handleTodo={handleAddTodo} />
				{todos.map(({ id, title, completed }) =>
					edit === id ? (
						<Input
							key={id}
							id={id}
							input={editInput}
							setInput={setEditInput}
							handleTodo={() => handleSave(id)}
						/>
					) : (
						<TodoItem
							key={id}
							id={id}
							title={title}
							completed={completed}
							handleEdit={handleEdit}
							putRequest={putRequest}
						/>
					)
				)}
			</div>
		</div>
	);
}

const TodoItem = ({ id, title, completed, handleEdit, putRequest }) => {
	const [isChecked, setIsChecked] = useState("");
	const { todos, deleteTodo, setTodos } = useTodos();

	const deleteRequest = async (todoId, completed) => {
		try {
			const res = await fetch("http://localhost:6565/api/todos", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: todoId,
					completed: completed,
				}),
			});

			if (!res.ok) throw new Error("Failed to delete");

			const data = await res.json();
			deleteTodo(data.id);
		} catch (error) {
			console.error(`Error deleting todo with id: ${todoId} - ${error.message}`);
		}
	};
	const handleDelete = (todoId) => {
		isChecked && deleteRequest(todoId);
	};
	const handleCheck = (todoId, checked) => {
		setIsChecked(checked);
		const newTodos = todos.map((todo) =>
			todo.id == todoId ? { ...todo, completed: !todo.completed } : todo
		);
		setTodos(newTodos);

		const title = todos.find((todo) => todo.id === todoId).title;
		const completed = !todos.find((todo) => todo.id === todoId).completed;
		putRequest(todoId, title, completed);
	};

	return (
		<div id={`item ${id}`} className="flex items-center justify-between p-3 border rounded-xl">
			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					checked={completed}
					className="w-5 h-5"
					onChange={(e) => handleCheck(id, e.target.checked)}
				/>
				<span className={`text-gray-700 ${completed && "line-through"}`}>{title}</span>
			</div>
			<div className="flex items-center gap-2">
				<button
					disabled={isChecked}
					className={`${
						isChecked
							? "text-gray-400 cursor-not-allowed"
							: "text-blue-500 hover:text-blue-700 cursor-pointer"
					}`}
					onClick={() => handleEdit(id, title)}
				>
					{" "}
					Edit
				</button>
				<button
					className="text-red-500 hover:text-red-700 cursor-pointer"
					onClick={() => {
						handleDelete(id);
					}}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

const Input = ({ id, input, setInput, handleTodo }) => {
	return (
		<div className="flex items-center gap-2">
			<input
				type="text"
				placeholder="Add a new todo..."
				value={input}
				className="flex-1 px-4 py-2 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300 text-gray-700 border-gray-100"
				onChange={(e) => setInput(e.target.value)}
			/>
			<button
				className="bg-blue-500 text-white px-4 py-2 rounded-[8px] cursor-pointer hover:bg-blue-600"
				onClick={handleTodo}
			>
				{id ? "Save" : "Add"}
			</button>
		</div>
	);
};
