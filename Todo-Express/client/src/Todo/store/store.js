import { create } from "zustand";

const useTodoStore = create((set) => ({
	todos: [],
	setTodos: (newTodos) => set({ todos: newTodos }),
	addTodo: (newTodo) => set((state) => ({ todos: [...state.todos, newTodo] })),
	editTodo: (todoId, value) =>
		set((state) => ({
			todos: state.todos.map((todo) => (todo.id === todoId ? { ...todo, title: value } : todo)),
		})),
	deleteTodo: (todoId) =>
		set((state) => ({
			todos: state.todos.filter((todo) => todo.id !== todoId),
		})),
}));

export const useTodos = () => {
	const todos = useTodoStore((state) => state.todos);
	const setTodos = useTodoStore((state) => state.setTodos);
	const addTodo = useTodoStore((state) => state.addTodo);
	const editTodo = useTodoStore((state) => state.editTodo);
	const deleteTodo = useTodoStore((state) => state.deleteTodo);

	return {
		todos,
		setTodos,
		addTodo,
		editTodo,
		deleteTodo,
	};
};
