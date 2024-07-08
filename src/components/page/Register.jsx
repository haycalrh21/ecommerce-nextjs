import React, { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useToast } from "../ui/use-toast";

export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { toast } = useToast();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email, password }), // Hapus role dari body request
		});
		if (res.ok) {
			router.push("/login");
			toast({
				title: "Success",
				description: `Register success`,
				duration: 1000,
				variant: "gray",
			});
		} else {
			toast({
				title: "Failed",
				description: `Register failed`,
				duration: 1000,
				variant: "gray",
			});
			console.error(await res.json());
		}
	};

	return (
		<>
			<Head>
				<title>Register</title>
			</Head>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className='min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8'
			>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<div className='text-center'>
						<h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
							Create your account
						</h2>
					</div>
					<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
						<input type='hidden' name='remember' value='true' />
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label htmlFor='name' className='sr-only'>
									Name
								</label>
								<input
									id='name'
									name='name'
									type='text'
									autoComplete='name'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
									placeholder='Name'
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor='email' className='sr-only'>
									Email address
								</label>
								<input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
									placeholder='Email address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor='password' className='sr-only'>
									Password
								</label>
								<input
									id='password'
									name='password'
									type='password'
									autoComplete='current-password'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
									placeholder='Password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>

						<div className='flex items-center justify-between'>
							<div className='text-sm'>
								<p className='text-gray-500'>
									By creating an account, you agree to our{" "}
									<a
										href='#'
										className='font-medium text-primary hover:text-primary-dark'
									>
										Terms
									</a>
									.
								</p>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className='w-full bg-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
							>
								Register
							</button>
							<p className='mt-4'>
								<Link href='/login' className='text-sm hover:underline'>
									Already have an account?{" "}
								</Link>
							</p>
						</div>
					</form>
				</div>
			</motion.div>
		</>
	);
}
