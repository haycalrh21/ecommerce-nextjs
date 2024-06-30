// src/pages/keranjang.js
import { useCart } from "@/hooks/cartContext";
import Link from "next/link";
import React from "react";

const Keranjang = () => {
	const { cart, removeFromCart } = useCart();

	return (
		<div className='md:w-4/5 mx-auto py-10 px-6  py-10'>
			<div className='container mx-auto px-4'>
				<h1 className='text-2xl font-bold mb-5'>Keranjang Belanja</h1>
				<div className='flex flex-col md:flex-row gap-4'>
					<div className='w-full md:w-5/5'>
						{cart.length > 0 ? (
							cart.map((item, index) => (
								<div
									key={index}
									className='bg-white p-5 rounded-lg shadow-md mb-5 flex items-center'
								>
									<img
										src={item.imageUrl}
										alt={item.name}
										className='w-24 h-24 object-cover rounded-lg mr-5'
									/>
									<div className='flex-1'>
										<h2 className='text-lg font-semibold'>{item.name}</h2>
										<p>Jumlah: {item.quantity}</p>
										<p>Price: Rp{item.price.toLocaleString()}</p>
									</div>
									<button
										onClick={() => removeFromCart(item.id)}
										className=' bg-black text-white p-2 hover:bg-red-600 ml-5 rounded-md'
									>
										Kurangi jumlah
									</button>
								</div>
							))
						) : (
							<div>
								<p className='text-lg font-semibold text-center justify-center'>
									Keranjang Anda kosong. Mulai berbelanja{" "}
									<Link href='/products' className='block  hover:underline '>
										klik disini
									</Link>
									.
								</p>
							</div>
						)}
					</div>
					{cart.length > 0 && (
						<div className='w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md h-fit'>
							<h2 className='text-lg font-semibold mb-4'>Summary</h2>
							<div className='flex justify-between mb-2'>
								<p>Subtotal</p>
								<p>
									Rp{" "}
									{cart
										.reduce(
											(total, item) => total + item.price * item.quantity,
											0
										)
										.toLocaleString()}
								</p>
							</div>
							<div className='flex justify-between mb-2'>
								<p>Tax</p>
								<p>FREE</p>
							</div>
							<div className='flex justify-between font-bold mb-4'>
								<p>Total</p>
								<p>
									Rp{" "}
									{cart
										.reduce(
											(total, item) => total + item.price * item.quantity,
											0
										)
										.toLocaleString()}
								</p>
							</div>
							<button className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'>
								Checkout
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Keranjang;

// <button
// 				// 				// disabled={!items.length}
// 				// 				// onClick={createCheckoutSession}
// 				// 				className='py-2 px-3 disabled:cursor-not-allowed text-white w-full mt-6 rounded-lg bg-cusblack '
// 				// 			>
// 				// 				{/* {!loading ? (
//                 //     <span className="flex justify-center place-items-center">
//                 //       CHECKOUT
//                 //       <svg
//                 //         className="ml-2 w-4 h-4 text-white"
//                 //         fill="none"
//                 //         stroke="currentColor"
//                 //         viewBox="0 0 24 24"
//                 //         xmlns="http://www.w3.org/2000/svg"
//                 //       >
//                 //         <path
//                 //           strokeLinecap="round"
//                 //           strokeLinejoin="round"
//                 //           strokeWidth={2}
//                 //           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                 //         />
//                 //       </svg>
//                 //     </span>
//                 //   ) : (
//                 //     <img
//                 //       className="w-6 h-6 mx-auto"
//                 //       src="https://i.ibb.co/pL1TJSg/Rolling-1s-200px-2.gif"
//                 //       alt=""
//                 //     />
//                 //   )} */}
// 							</button>
