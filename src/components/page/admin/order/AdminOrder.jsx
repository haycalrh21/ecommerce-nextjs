import React, { useEffect, useState } from "react";
import { AdminDashboard, AdminLayout } from "../AdminLayout";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminOrder() {
	const { data: session, status } = useSession();
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			if (session) {
				try {
					const res = await fetch("/api/order", {
						headers: {
							Authorization: `Bearer ${session.accessToken}`,
						},
					});
					const data = await res.json();
					setOrders(data.data);
				} catch (error) {
					console.error("Error fetching orders:", error);
				}
			}
		};

		fetchOrders();
	}, [session]);

	if (status === "loading") return <p>Loading...</p>;
	if (!session) return <p>Please log in</p>;

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
	return (
		<AdminLayout>
			<h1>Admin Orders</h1>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white'>
					<thead>
						<tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
							<th className='py-3 px-6 text-left'>Name</th>
							<th className='py-3 px-6 text-left'>Email</th>
							<th className='py-3 px-6 text-left'>Phone</th>
							<th className='py-3 px-6 text-left'>Address</th>
							<th className='py-3 px-6 text-left'>Status</th>
							<th className='py-3 px-6 text-left'>Created At</th>
							<th className='py-3 px-6 text-left'>Updated At</th>
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
								<td className='py-3 px-6 text-left'>{order.email}</td>
								<td className='py-3 px-6 text-left'>{order.phone}</td>
								<td className='py-3 px-6 text-left'>{order.address}</td>
								<td className='py-3 px-6 text-left'>{order.status}</td>
								<td className='py-3 px-6 text-left'>
									{formatToLocalTime(order.createdAt)}
								</td>
								<td className='py-3 px-6 text-left'>
									{formatToLocalTime(order.updatedAt)}
								</td>
								<td className='py-3 px-6 text-left'>
									<ul>
										{order.cartItems.map((item) => (
											<li key={item._id}>
												<Link
													href={`/product/${item.slug}`}
													className='hover:underline'
												>
													{item.name}
												</Link>
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
		</AdminLayout>
	);
}
