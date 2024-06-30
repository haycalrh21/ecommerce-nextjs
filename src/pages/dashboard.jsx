import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const Dashboard = () => {
	const { data: session, status } = useSession();

	const router = useRouter();
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			if (session) {
				try {
					const res = await fetch("/api/orderUser", {
						headers: {
							Authorization: `Bearer ${session.accessToken}`,
						},
					});
					const data = await res.json();
					// Filter orders only for the current user
					const filteredOrders = data.data.filter(
						(order) => order.email === session.user.email
					);
					setOrders(filteredOrders);
				} catch (error) {
					console.error("Error fetching orders:", error);
				}
			}
		};

		fetchOrders();
	}, [session]);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status]);

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
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<h1 className='text-2xl mb-4'>Welcome, {session?.user?.name}</h1>
			<Tabs defaultValue='order' className='w-full items-center justify-center'>
				<TabsList>
					<TabsTrigger value='order'>Order</TabsTrigger>
					<TabsTrigger value='password'>Password</TabsTrigger>
				</TabsList>
				<TabsContent value='order'>
					{orders.length > 0 ? (
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
					) : (
						<p className='text-center mt-4'>No orders found.</p>
					)}
				</TabsContent>
				{/* <TabsContent value="password">Change your password here.</TabsContent> */}
			</Tabs>
		</div>
	);
};

export default Dashboard;
