import { useCart } from "@/hooks/cartContext";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";
import { Shirt, ShoppingCart, Users } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
	const { data } = useSession();
	const { cart } = useCart();
	const [isClick, setisClick] = useState(false);

	const toggleNavbar = () => {
		setisClick(!isClick);
	};

	const closeNavbar = () => {
		setisClick(false);
	};

	return (
		<nav className='' style={{ backgroundColor: "#2F3645" }}>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg-px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<div className='flex-shrink-0' style={{ color: "#E2DFD0" }}>
							<Link href='/' className='flex items-center gap-4'>
								<Image src='/logo.png' alt='Logo' width={80} height={40} />
								<span>Toko Xyz</span>
							</Link>
						</div>
					</div>
					<div className='hidden md:block'>
						<div className='ml-4 flex items-center space-x-4'>
							<div className='relative mr-2'>
								<Link href='/products' passHref>
									<p className='relative flex items-center'>
										<Shirt
											className='w-8 h-8 rounded-md'
											style={{ stroke: "#EEEDEB" }}
										/>
									</p>
								</Link>
							</div>
							<div className='relative mr-8'>
								<Link href='/keranjang' passHref>
									<p className='relative flex items-center'>
										<ShoppingCart
											className='w-8 h-8 mr-3 rounded-md'
											style={{ stroke: "#EEEDEB" }}
										/>
										{cart.length > 0 && (
											<div className='absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-white rounded-full text-xs text-black'>
												{cart.length}
											</div>
										)}
									</p>
								</Link>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar>
										{data?.user.image ? (
											<AvatarImage src={data.user.image} />
										) : data?.user ? (
											<img
												src='/male.png'
												alt='Default Avatar'
												className='w-10 h-10'
											/>
										) : (
											<Users
												className='w-10 h-10 rounded-md'
												style={{ stroke: "#EEEDEB" }}
											/>
										)}
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{data ? (
										<DropdownMenuLabel className='cursor-pointer hover:text-gray-400 hover:underline'>
											<Link href={`/dashboard/${data?.user?.email}`}>
												Dashboard
											</Link>
										</DropdownMenuLabel>
									) : (
										<DropdownMenuLabel
											onClick={() => (window.location.href = "/register")}
											className='cursor-pointer hover:underline hover:text-gray-500'
										>
											Register
										</DropdownMenuLabel>
									)}
									<DropdownMenuLabel
										className='cursor-pointer hover:text-gray-400 hover:underline'
										onClick={() => {
											closeNavbar(); // Menutup dropdown saat Logout/Login diklik
											data ? signOut() : signIn();
										}}
									>
										{data ? "Log Out" : "Login"}
									</DropdownMenuLabel>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className='md:hidden flex items-center'>
						<button
							className='inline-flex items-center justify-center p-2 rounded-md text-white md:text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
							onClick={toggleNavbar}
						>
							{isClick ? (
								<svg
									className='h-6 w-6'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							) : (
								<svg
									className='h-6 w-6'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 6h16M4 12h16m-7 6h7'
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
				{isClick && (
					<div className='md:hidden'>
						<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
							<div className='text-white hover:bg-white hover:text-black rounded-lg p-1'>
								<Link href='/products'>
									<Button
										className='bg-white text-black hover:bg-white hover:text-black rounded-lg p-1 w-full'
										onClick={closeNavbar} // Menutup dropdown saat Produk diklik
									>
										Product
									</Button>
								</Link>
							</div>
							<div className='text-white hover:bg-white hover:text-black rounded-lg p-1'>
								<Link href='/keranjang'>
									<Button
										className='bg-white text-black hover:bg-white hover:text-black rounded-lg p-1 w-full'
										onClick={closeNavbar} // Menutup dropdown saat Keranjang diklik
									>
										Keranjang
									</Button>
								</Link>
							</div>
							<div className='text-white hover:bg-white hover:text-black rounded-lg p-1'>
								{data ? (
									<Link href={`/dashboard/${data?.user?.email}`}>
										<Button
											className='bg-white text-black hover:bg-white hover:text-black rounded-lg p-1 w-full'
											onClick={closeNavbar} // Menutup dropdown saat Dashboard diklik
										>
											Dashboard
										</Button>
									</Link>
								) : (
									<div className='hidden' disabled>
										null
									</div>
								)}
							</div>
							<div className='text-white hover:bg-white hover:text-black rounded-lg p-1'>
								<Button
									className='bg-white text-black hover:bg-white hover:text-black rounded-lg p-1 w-full'
									onClick={() => {
										closeNavbar(); // Menutup dropdown saat Logout/Login diklik
										data ? signOut() : signIn();
									}}
								>
									{data ? "Log Out" : "Login"}
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
