import { create } from "zustand";
import type { Todo } from "../types";

type TodosStore = {
	todos: Todo[];
	setTodos: (newTodos: Todo[]) => void;
	addTodo: (newTodo: Todo) => void;
	updateTodo: (id: string, title: string) => void;
	deleteTodo: (id: string) => void;
};

const useTodosStore = create<TodosStore>((set, get) => ({
	todos: [],
	setTodos: (newTodos: Todo[]) => set({ todos: newTodos }),
	addTodo: (newTodo: Todo) => set((state) => ({ todos: [...state.todos, newTodo] })),
	updateTodo: (id: string, title: string) =>
		set((state) => ({
			todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title: title } : todo)),
		})),
	deleteTodo: (id: string) => {
		const items = get().todos;
		const updated = items.filter((item) => item.id !== id);
		set({ todos: updated });
	},
}));

export const useTodos = () => {
	const todos = useTodosStore((state) => state.todos);
	const addTodo = useTodosStore((state) => state.addTodo);
	const setTodos = useTodosStore((state) => state.setTodos);
	const updateTodo = useTodosStore((state) => state.updateTodo);
	const deleteTodo = useTodosStore((state) => state.deleteTodo);
	return {
		todos,
		addTodo,
		setTodos,
		updateTodo,
		deleteTodo,
	};
};
