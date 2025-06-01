import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import pool from "./db/db.js";

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

async function createTodosTable() {
	const query = `
    CREATE TABLE IF NOT EXISTS todos (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL UNIQUE,
      completed BOOLEAN DEFAULT FALSE
    )
  `;
	try {
		await pool.query(query);
		console.log("Todos table ready");
	} catch (err) {
		console.error("Error creating table:", err.message);
	}
}

async function insertInitialTodos() {
	for (const todo of initialTodos) {
		try {
			await pool.query(
				`INSERT INTO todos (id, title, completed) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
				[todo.id, todo.title, todo.completed]
			);
			console.log(`Inserted: ${todo.title}`);
		} catch (err) {
			console.error("Insert error:", err.message);
		}
	}
}

async function setup() {
	await createTodosTable();
	await insertInitialTodos();
}

setup();

app.get("/api/todos", async (req, res) => {
	try {
		const { rows } = await pool.query("SELECT * FROM todos");
		res.json(rows);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: "Database read error" });
	}
});

app.post("/api/todos", async (req, res) => {
	const { title, completed = false } = req.body;
	if (!title) {
		return res.status(400).json({ message: "Title is required" });
	}
	try {
		const id = uuidv4();
		await pool.query("INSERT INTO todos (id, title, completed) VALUES ($1, $2, $3)", [
			id,
			title,
			completed,
		]);
		const newTodo = { id, title, completed: completed };
		res.status(201).json(newTodo);
	} catch (err) {
		if (err.code === "23505") {
			// unique_violation
			return res.status(409).json({ message: "Title must be unique" });
		}
		console.error(err.message);
		res.status(500).json({ message: "Database insert error" });
	}
});

app.put("/api/todos", async (req, res) => {
	const { id, title, completed } = req.body;

	if (!id) return res.status(400).json({ message: "ID is required" });

	try {
		const result = await pool.query(
			`UPDATE todos SET
         title = COALESCE($1, title),
         completed = COALESCE($2, completed)
       WHERE id = $3`,
			[title, completed, id]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ message: "Todo not found" });
		}

		const { rows } = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
		res.json({ message: "Todo updated", todo: rows[0] });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Database update error" });
	}
});

app.delete("/api/todos", async (req, res) => {
	const { id } = req.body;

	if (!id) return res.status(400).json({ error: "ID is required" });

	try {
		// Check if todo exists and is completed
		const { rows } = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Todo not found" });
		}
		const todo = rows[0];
		if (!todo.completed) {
			return res.status(403).json({ error: "Todo must be completed to delete" });
		}

		// Delete
		await pool.query("DELETE FROM todos WHERE id = $1", [id]);
		res.status(200).json({ message: "Todo deleted", todo });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: "Database delete error" });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
