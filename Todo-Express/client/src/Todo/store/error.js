import { create } from "zustand";

const useErrorStore = create((set) => ({
	error: "",
	setError: (value) => set({ error: value }),
}));

export const useError = () => {
	const error = useErrorStore((state) => state.error);
	const setError = useErrorStore((state) => state.setError);
	return {
		error,
		setError,
	};
};

const useErrorIdStore = create((set) => ({
	errorId: "",
	setErrorId: (id) => set({ errorId: id }),
}));

export const useErrorId = () => {
	const errorId = useErrorIdStore((state) => state.errorId);
	const setErrorId = useErrorIdStore((state) => state.setErrorId);
	return {
		errorId,
		setErrorId,
	};
};
