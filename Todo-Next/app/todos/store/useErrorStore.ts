import { create } from "zustand";
import { combine } from "zustand/middleware";

const useErrorStore = create(
	combine(
		{
			error: "",
			errorId: "",
		},
		(set) => ({
			setError: (newError: string) => set({ error: newError }),
			setErrorId: (id: string) => set({ errorId: id }),
		})
	)
);

export const useError = () => {
	const error = useErrorStore((state) => state.error);
	const setError = useErrorStore((state) => state.setError);
	return { error, setError };
};

export const useErrorId = () => {
	const errorId = useErrorStore((state) => state.errorId);
	const setErrorId = useErrorStore((state) => state.setErrorId);
	return { errorId, setErrorId };
};
