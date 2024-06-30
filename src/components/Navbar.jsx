import { useCart } from "@/hooks/cartContext";
import { useUser } from "@/hooks/getUser";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";

export default function Navbar() {
	const { data: session } = useSession();
	// console.log(session);
	const router = useRouter();
	const { cart } = useCart();

	const handleLogout = async () => {
		try {
			await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`,
				{
					withCredentials: true,
				}
			);
			mutate(null, false); // Mutate dengan null untuk menghapus user dari state
			router.push("/logiin");
		} catch (error) {
			// console.error(error.response ? error.response.data : error.message);
			alert("Logout failed");
		}
	};
	const handleLogin = () => {
		router.push("/logiin");
	};

	return (
		<nav className='w-full mx-auto fixed bg-zinc-500 z-30 py-2 md:px-0 duration-200'>
			<div className='px-2 navtop relative max-w-6xl mx-auto flex justify-between place-items-center py-1.5'>
				<div className='burger flex items-center'>
					<h3 className='hidden md:inline text-md mr-2 font-semibold ml-3 text-cusblack'>
						<Link href='/'>XYZ Store</Link>
						{/* <p>{user?.name}</p> */}
					</h3>
				</div>
				<div className='profile flex items-center place-items-center'>
					<Link href='/products'>
						<div className='w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer duration-200'>
							<svg
								className='w-6 h-6 text-cusblack m-auto'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
								/>
							</svg>
						</div>
					</Link>
					<div className='w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer duration-200'>
						<Link href='/keranjang'>
							<div className='relative flex items-center h-8 mr-1 cursor-pointer'>
								<svg
									className='w-6 h-6 text-cusblack m-auto'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 11V7a4 4 0 00-8 0v4m8 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m8-4H6m10 0a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h14z'
									/>
								</svg>
								{cart.length > 0 && (
									<div className='absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-cusblack rounded-full text-xs text-white'>
										{cart.length}
									</div>
								)}
							</div>
						</Link>
					</div>
					<Link href='/wishlist'>
						<div className='w-8 relative flex items-center h-8 mr-1 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer duration-200'>
							<svg
								className='w-6 m-auto h-6 text-cusblack'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
								/>
							</svg>
						</div>
					</Link>

					<button className='w-8 relative flex items-center h-8 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer duration-200'>
						<Link href='/login'>
							<svg
								className='w-6 m-auto h-6 text-cusblack'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
								/>
							</svg>
						</Link>
					</button>
					<div>
						{session ? (
							<button
								onClick={() => signOut()}
								className='w-full bg-black rounded-md p-1 text-white hover:bg-red-500 text-black'
							>
								Logout
							</button>
						) : (
							<button
								className='w-full bg-black rounded-md p-1 text-white hover:bg-red-500 text-black'
								onClick={() => signIn()}
							>
								Login
							</button>
						)}
					</div>
					{/* <button
						className='w-8 relative flex items-center h-8 rounded-full hover:bg-gray-200 active:bg-gray-300 cursor-pointer duration-200'
						onClick={() => (data ? signOut() : signIn())}
					>
						{data ? "Logout" : "Login"}
					</button> */}
				</div>
			</div>

			{/* <MenuNav handleOpen={handleOpen} isOpen={isOpen} /> */}
		</nav>
	);
}
