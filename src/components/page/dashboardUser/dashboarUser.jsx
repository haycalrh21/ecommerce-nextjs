import { getSession, useSession } from "next-auth/react";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Nota from "@/components/nota"; // Sesuaikan dengan path komponen Nota
import { useRouter } from "next/router";

export default function DashboardUser({ orders, wishlist }) {
	const { data: session, status } = useSession();
	const [selectedOrder, setSelectedOrder] = useState(null);
	const router = useRouter();
	const handleWishlistAction = (item) => {
		// Logika untuk aksi pada wishlist item
		// console.log(`Aksi untuk item dengan ID ${item.productId}`);
	};

	const formatToLocalTime = (utcDateString) => {
		const options = {
			timeZone: "Asia/Jakarta",
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
		};
		return new Date(utcDateString).toLocaleString("en-ID", options);
	};

	const bayar = async (order) => {
		try {
			const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
			const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

			if (!window.snap) {
				const script = document.createElement("script");
				script.src = snapScript;
				script.setAttribute("data-client-key", clientKey);
				script.async = true;
				document.body.appendChild(script);

				script.onload = () => {
					initiatePayment(order);
				};
			} else {
				initiatePayment(order);
			}
		} catch (error) {
			console.error("Error during payment:", error);
		}
	};

	const initiatePayment = (order) => {
		window.snap.pay(order.token, {
			onSuccess: async (result) => {
				try {
					await axios.put(
						"/api/checkout",
						{
							orderId: order._id,
							status: "sudah bayar",
						},
						{
							headers: {
								Authorization: `Bearer ${session.accessToken}`,
							},
						}
					);

					fetchOrders();
				} catch (error) {
					console.error("Error updating order status:", error);
					router.push(`/dashboard/${session?.user?.email}`);
				}
			},
			onClose: () => {
				router.push(`/dashboard/${session?.user?.email}`);

				console.log("Payment closed without completion");
			},
		});
	};

	return (
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<h1 className='text-2xl mb-4'>Welcome, {session?.user?.name}</h1>
			<Tabs defaultValue='order' className='w-full items-center justify-center'>
				<TabsList>
					<TabsTrigger value='order'>Order</TabsTrigger>
				</TabsList>
				<TabsList>
					<TabsTrigger value='wishlist'>wishlist</TabsTrigger>
				</TabsList>
				<TabsContent value='order'>
					{orders.length > 0 ? (
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white'>
								<thead>
									<tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
										<th className='py-3 px-6 text-left'>Name</th>
										<th className='py-3 px-6 text-left'>Actions</th>
										<th className='py-3 px-6 text-left'>Status</th>
										<th className='py-3 px-6 text-left'>Email</th>
										<th className='py-3 px-6 text-left'>Phone</th>
										<th className='py-3 px-6 text-left'>Address</th>
										<th className='py-3 px-6 text-left'>Created At</th>
										<th className='py-3 px-6 text-left'>Items</th>
									</tr>
								</thead>
								<tbody className='text-gray-600 text-sm font-light'>
									{orders.map((order) => (
										<tr
											key={order._id}
											className='border-b border-gray-200 hover:bg-gray-100'
										>
											<td className='py-3 px-6 text-left'>{order.name}</td>
											<td className='py-3 px-6 text-left'>
												{order.status === "belum bayar" ? (
													<Button onClick={() => bayar(order)}>Bayar</Button>
												) : (
													<div>
														<Button
															onClick={() => setSelectedOrder(order)}
															className='bg-green-500'
														>
															Invoice
														</Button>
													</div>
												)}
											</td>
											<td className='py-3 px-6 text-left'>{order.status}</td>
											<td className='py-3 px-6 text-left'>{order.email}</td>
											<td className='py-3 px-6 text-left'>{order.phone}</td>
											<td className='py-3 px-6 text-left'>{order.address}</td>
											<td className='py-3 px-6 text-left'>
												{formatToLocalTime(order.createdAt)}
											</td>
											<td className='py-3 px-6 text-left'>
												<ul>
													{order.cartItems.map((item) => (
														<li key={item.id}>
															<Link
																href={`/product/${item.slug}`}
																className='hover:underline'
															>
																{item.name}
															</Link>{" "}
															- Quantity: {item.quantity}
														</li>
													))}
												</ul>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className='text-center mt-4'>No orders found.</p>
					)}
				</TabsContent>
				<TabsContent value='wishlist'>
					{wishlist.length > 0 ? (
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white'>
								<thead>
									<tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
										<th className='py-3 px-6 text-left'>Product Name</th>
										<th className='py-3 px-6 text-left'>Price</th>
										<th className='py-3 px-6 text-left'>Image</th>
										<th className='py-3 px-6 text-left'>Actions</th>
									</tr>
								</thead>
								<tbody className='text-gray-600 text-sm font-light'>
									{wishlist.map((item) => (
										<tr
											key={item.productId}
											className='border-b border-gray-200 hover:bg-gray-100'
										>
											<td className='py-3 px-6 text-left'>{item.name}</td>
											<td className='py-3 px-6 text-left'>{item.price}</td>
											<td className='py-3 px-6 text-left'>
												<img
													src={item.images[0]}
													alt={item.name}
													className='h-20 w-auto object-cover'
												/>
											</td>
											<td className='py-3 px-6 text-left'>
												<Button onClick={() => handleWishlistAction(item)}>
													Aksi
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className='text-center mt-4'>No wishlist items found.</p>
					)}
				</TabsContent>
			</Tabs>

			{selectedOrder && (
				<div className='fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-4 rounded-md relative w-full max-w-md mx-2'>
						<Button
							onClick={() => setSelectedOrder(null)}
							className='absolute top-8 right-4 p-1 bg-red-500 text-white rounded-md focus:outline-none'
						>
							Close
						</Button>
						<Nota order={selectedOrder} />
					</div>
				</div>
			)}
		</div>
	);
}
