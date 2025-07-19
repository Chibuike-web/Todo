"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { schema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/schema";
import Link from "next/link";

export default function Login() {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });

	const onSubmit = (data: FormData) => {
		console.log(data);
	};

	return (
		<section className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<main className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
				<div className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900 mb-2">Log in</h1>
					<p className="text-sm text-gray-500 mb-6">Log into your account</p>
				</div>

				<form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
					<fieldset className="mb-4">
						<Label htmlFor="email" className="mb-2">
							Email
						</Label>
						<Input type="email" id="email" {...register("email")} placeholder="you@example.com" />
						{errors.email && (
							<p className="text-red-500 text-[14px] mt-1">{errors.email.message}</p>
						)}
					</fieldset>

					<fieldset className="mb-8">
						<Label htmlFor="password" className="mb-2">
							Password
						</Label>
						<Input type="password" id="password" {...register("password")} placeholder="••••••••" />
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
			</main>
		</section>
	);
}
