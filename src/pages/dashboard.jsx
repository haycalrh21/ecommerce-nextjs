import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Dashboard = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [orders, setOrders] = useState([]);

	// Fetch orders
	const fetchOrders = async () => {
		try {
			const res = await fetch("/api/orderUser", {
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			});
			const data = await res.json();
			const filteredOrders = data.data.filter(
				(order) => order.email === session.user.email
			);
			setOrders(filteredOrders);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	useEffect(() => {
		// Fetch transactions on initial load

		// Fetch orders when session changes
		if (session) {
			fetchOrders();
		}
	}, [session]);

	useEffect(() => {
		// Redirect to login if unauthenticated
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

	const bayar = async (order) => {
		try {
			const response = await axios.post(
				"/api/midtrans",
				{
					orderId: order._id,
					customerDetails: {
						first_name: session?.user?.name,
						email: session?.user?.email,
					},
					item_details: order.cartItems.map((item) => ({
						id: item._id,
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					})),
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization:
							"Basic " +
							btoa(process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY + ":"),
					},
				}
			);

			const data = response.data;

			if (response.status === 200) {
				if (window.snap) {
					window.snap.pay(data.token, {
						onSuccess: async function (result) {
							const grossAmount = order.cartItems.reduce(
								(total, item) => total + item.price * item.quantity,
								0
							);

							try {
								await axios.post(
									"/api/transaction",
									{
										orderId: order._id,
										userId: session?.user?.name,
										paymentMethod: "Midtrans",
										grossAmount: grossAmount,
										status: "sudah bayar", // Sesuaikan status transaksi sesuai kebutuhan
									},
									{
										headers: {
											"Content-Type": "application/json",
										},
									}
								);

								// Set status 'sudah bayar' pada pesanan menggunakan endpoint `api/checkout`
								await axios.put(
									"/api/checkout",
									{
										orderId: order._id,
										status: "sudah bayar",
									},
									{
										headers: {
											"Content-Type": "application/json",
										},
									}
								);

								alert("Pembayaran berhasil!");
								window.location.href = "/thanks";
							} catch (error) {
								console.error("Error saving transaction:", error);
								alert("Terjadi kesalahan saat menyimpan transaksi!");
							}
						},
						onError: function (result) {
							console.error("Error during payment:", result);
							alert("Pembayaran gagal!");
						},
						onClose: function () {
							console.log("Snap popup closed");
						},
					});
				} else {
					alert("Snap.js tidak ditemukan!");
				}
			} else {
				alert(data.message || "Terjadi kesalahan!");
			}
		} catch (error) {
			console.error("Error during payment:", error);
			alert("Terjadi kesalahan saat pembayaran!");
		}
	};

	useEffect(() => {
		// Render Midtrans Snap token
		const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
		const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

		const script = document.createElement("script");
		script.src = snapScript;
		script.setAttribute("data-client-key", clientKey);
		script.async = true;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<h1 className='text-2xl mb-4'>Welcome, {session?.user?.name}</h1>
			<Tabs defaultValue='order' className='w-full items-center justify-center'>
				<TabsList>
					<TabsTrigger value='order'>Order</TabsTrigger>
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
											<td className='py-3 px-6 text-left'>
												{order.status === "belum bayar" ? (
													<Button onClick={() => bayar(order)}>Bayar</Button>
												) : (
													<div>
														<Button className='cursor-not-allowed bg-green-500'>
															Sudah Bayar
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
			</Tabs>
		</div>
	);
};

export default Dashboard;
