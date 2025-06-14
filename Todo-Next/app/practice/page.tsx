"use client";

import { FormEvent, useState } from "react";

export default function Input() {
	const [input, setInput] = useState("");
	const [inputContents, setInputContents] = useState<string[]>([]);
	const handleChange = (e: FormEvent) => {
		const { value } = e.target as HTMLInputElement;
		setInput(value);
		if (value.endsWith(",")) {
			setInputContents((prev) => [...prev, value.slice(0, -1)]);
			setInput("");
		}
	};
	const handleClick = () => {};
	return (
		<main className="justify-items-center content-center w-screen h-screen bg-white">
			<div className="flex gap-4 w-full max-w-[550px]">
				<div className="border border-blue flex items-center flex-wrap py-2 px-4 rounded-xl w-full max-w-[450px] gap-4">
					<div className="flex gap-2 flex-wrap">
						{inputContents.map((content) => (
							<span key={content} className="bg-blue-500 px-4 py-2 rounded-full text-[14px] block">
								{content}
							</span>
						))}
					</div>
					<input
						type="text"
						placeholder="Add a new todo..."
						value={input}
						className="px-4 placeholder:text-gray-300 text-gray-700 focus:outline-none focus:ring-0 w-full"
						onChange={handleChange}
					/>
				</div>
			</div>
		</main>
	);
}
