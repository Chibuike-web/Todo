"use client";

import { FormEvent, useRef, useState } from "react";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "motion/react";

export default function Input() {
	const [input, setInput] = useState("");
	const [tags, setTags] = useState<{ id: string; label: string }[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);
	const handleChange = (e: FormEvent) => {
		const { value } = e.target as HTMLInputElement;
		setInput(value);
		if (value.endsWith(",")) {
			const trimmed = value.slice(0, -1).trim();
			if (trimmed !== "") {
				setTags((prev) => [...prev, { id: uuidv4(), label: trimmed }]);
			}
			setInput("");
		}
	};

	const removeTag = (id: string) => {
		const newList = tags.filter((t) => t.id !== id);
		setTags(newList);
		inputRef.current?.focus();
	};

	return (
		<main className="justify-items-center content-center w-screen h-screen bg-white">
			<div className="flex gap-4 w-full max-w-[550px]">
				<div
					className="border border-blue flex items-center flex-wrap py-2 px-4 rounded-xl w-full max-w-[450px] gap-2"
					onClick={() => inputRef.current?.focus()}
				>
					<AnimatePresence>
						{tags.map((tag, index) => (
							<motion.div
								key={tag.id}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.5 }}
								transition={{ duration: 0.2 }}
								className="bg-blue-500 pl-3 pr-1.5 py-1 rounded-full text-[14px] flex gap-2 items-center transition-all duration-300 ease-in-out transform hover:scale-105"
								onClick={(e) => e.stopPropagation()}
							>
								{tag.label}
								<button
									className="bg-white/30 p-1 rounded-full flex items-center justify-center"
									onClick={() => removeTag(tag.id)}
								>
									<X className="size-3 text-white flex-shrink-0" />
								</button>
							</motion.div>
						))}
					</AnimatePresence>
					<input
						type="text"
						ref={inputRef}
						placeholder="Add a new tag"
						value={input}
						className="w-full max-w-[200px] px-2 placeholder:text-gray-300 text-gray-700 focus:outline-none focus:border focus:border-blue-500 rounded-[4px] min-h-[32px]"
						onChange={handleChange}
					/>
				</div>
			</div>
		</main>
	);
}
