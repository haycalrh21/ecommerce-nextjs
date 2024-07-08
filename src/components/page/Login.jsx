import { useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Spinner from "../ui/spinner/Spinner";
import { useToast } from "../ui/use-toast";

export default function Login() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false); // State untuk loading

	const { toast } = useToast();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true); // Set loading true saat mulai submit

		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (result.error) {
				toast({
					title: "Failed",
					description: `Login failed`,
					duration: 1000,
					variant: "gray",
				});

				setError("Login failed. Please check your credentials and try again.");
				setLoading(false); // Set loading false setelah login gagal
			} else {
				// Ambil session setelah login berhasil
				const session = await getSession();
				const { role } = session.user;

				// Redirect berdasarkan role
				if (role === "admin") {
					router.push("/admin/dashboard");
					toast({
						title: "Success",
						description: `Login success`,
						duration: 1000,
						variant: "gray",
					});
				} else {
					router.push(`/dashboard/${email}`);
					toast({
						title: "Success",
						description: `Login success`,
						duration: 1000,
						variant: "gray",
					});
				}
			}
		} catch (error) {
			toast({
				title: "Error",
				description: `Login error`,
				duration: 1000,
				variant: "gray",
			});
			console.error("Login error:", error);
			setError("Error during login. Please try again later.");
			setLoading(false); // Set loading false jika terjadi error
		}
	};

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<div className='min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<div className='text-center'>
						<h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
							Sign in to your account
						</h2>
					</div>
					<form className='mt-8 space-y-6' onSubmit={handleSubmit}>
						<input type='hidden' name='remember' value='true' />
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label htmlFor='email-address' className='sr-only'>
									Email address
								</label>
								<input
									id='email-address'
									name='email'
									type='email'
									autoComplete='email'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm'
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

						{error && <div className='text-red-500 text-sm mt-2'>{error}</div>}

						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<input
									id='remember-me'
									name='remember-me'
									type='checkbox'
									className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
								/>
								<label
									htmlFor='remember-me'
									className='ml-2 block text-sm text-gray-900'
								>
									Remember me
								</label>
							</div>

							<div className='text-sm'>
								<a
									href='#'
									className='font-medium text-primary hover:text-primary-dark'
								>
									Forgot your password?
								</a>
							</div>
						</div>

						<div>
							<button
								type='submit'
								disabled={loading} // Disable button saat loading
								className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
									loading
										? "bg-gray-400 cursor-not-allowed"
										: "bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
								}`}
							>
								{loading ? <Spinner /> : "Sign in"}
							</button>
							<p className='mt-4'>
								<Link
									href={"/register"}
									className='text-sm hover:underline mt-20'
								>
									{" "}
									Dont have account?
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
