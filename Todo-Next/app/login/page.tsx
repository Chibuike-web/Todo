"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";
import { useToggleVisibility } from "../Hooks";
import { authSchema, FormData } from "../lib/authSchema";

export default function Login() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(authSchema) });

	const { toggleVisibility, handleToggleVisibility } = useToggleVisibility();

	const onSubmit = (data: FormData) => {
		console.log(data);
	};

	return (
		<main className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<section className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Log in</h1>
					<p className="text-sm text-gray-500 mb-6">Log into your account</p>
				</div>

				<form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
					<fieldset className="mb-4">
						<Label htmlFor="email" className="mb-2">
							Email
						</Label>
						<Input
							type="email"
							id="email"
							{...register("email")}
							className="text-[14px] placeholder:text-[14px]"
							placeholder="you@example.com"
						/>
						{errors.email && (
							<p className="text-red-500 text-[14px] mt-1">{errors.email.message}</p>
						)}
					</fieldset>

					<fieldset className="mb-8 relative">
						<Label htmlFor="password" className="mb-2">
							Password
						</Label>
						<div className="relative">
							<Input
								type={toggleVisibility ? "text" : "password"}
								id="password"
								{...register("password")}
								className="text-[14px] placeholder:text-[14px]"
								placeholder="Enter your password"
							/>
							<button
								onClick={handleToggleVisibility}
								type="button"
								className="absolute right-2 top-1/2 -translate-y-1/2"
							>
								{toggleVisibility ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							</button>
						</div>

						{errors.password && (
							<p className="text-red-500 text-[14px] mt-1">{errors.password.message}</p>
						)}
					</fieldset>

					<Button className="w-full" type="submit">
						Login
					</Button>
				</form>

				<p className="text-sm text-center text-gray-600">
					Don't have an account?{" "}
					<Link href="/signup" className="text-blue-600 hover:underline cursor-pointer">
						Sign In
					</Link>
				</p>
			</section>
		</main>
	);
}
