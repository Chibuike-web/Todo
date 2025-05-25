import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import db from "./db/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6565;

app.use(cors());
app.use(express.json());

let initialTodos = [
	{ id: uuidv4(), title: "Buy groceries", completed: false },
	{ id: uuidv4(), title: "Finish React project", completed: false },
	{ id: uuidv4(), title: "Go for a walk", completed: false },
];

// db.prepare('DELETE FROM todos').run();

const insert = db.prepare(`INSERT OR IGNORE INTO todos (id, title, completed) VALUES (?, ?, ?)`);

initialTodos.forEach((todo) => {
	try {
		insert.run(todo.id, todo.title, todo.completed ? 1 : 0);
		console.log(`Inserted: ${todo.title}`);
	} catch (err) {
		console.error("Insert error:", err.message);
	}
});

app.get("/api/todos", (req, res) => {
	try {
		const stmt = db.prepare("SELECT * FROM todos");
		const todos = stmt.all();
		res.json(todos);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: "Database read error" });
	}
});

app.post("/api/todos", (req, res) => {
	const { title, completed } = req.body;
	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}
	try {
		const id = uuidv4();
		const insert = db.prepare("INSERT INTO todos (id, title, completed) VALUES (?, ?, ?)");
		insert.run(id, title, completed ? 1 : 0);
		const newTodo = { id, title, completed: completed };
		res.status(201).json(newTodo);
	} catch (error) {
		if (err.message.includes("UNIQUE constraint failed")) {
			return res.status(409).json({ message: "Title must be unique" });
		}
		console.error(err.message);
		res.status(500).json({ message: "Database insert error" });
	}
});

app.put("/api/todos/", (req, res) => {
	const { id, title, completed } = req.body;
	const stmt = db.prepare(`UPDATE todos SET title= COALESCE(?, title),
	completed = COALESCE(?, completed)
	WHERE id = ?`);

	const result = stmt.run(title, completed !== undefined ? (completed ? 1 : 0) : null, id);

	if (result.changes === 0) {
		return res.status(404).json({ message: "Todo not found" });
	}
	res.json({ message: "Todo updated" });
});

app.delete("/api/todos/", (req, res) => {
	const { id, completed } = req.body;

	const exists = todos.some((todo) => todo.id === id);
	if (!exists) {
		return res.status(404).json({ message: "Todo not found" });
	}

	const todo = todos.find((todo) => todo.id === id);
	todos = todos.filter((todo) => todo.id !== id && todo.completed !== completed);
	res.json(todo);
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
