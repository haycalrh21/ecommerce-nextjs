import { useCart } from "@/hooks/cartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner/Spinner";

const Keranjang = () => {
	const { data: session, status } = useSession();
	const { cart, removeFromCart, clearCart } = useCart();
	const [checkoutStep, setCheckoutStep] = useState(1);
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		address: "",
		phone: "",
	});

	const [totalAmount, setTotalAmount] = useState(0);

	useEffect(() => {
		if (session?.user?.email) {
			setFormData((prevFormData) => ({
				...prevFormData,
				email: session.user.email,
			}));
		}
	}, [session]);

	useEffect(() => {
		const amount = cart.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
		setTotalAmount(amount);
	}, [cart]);

	const handleCheckout = async (e) => {
		e.preventDefault();
		setLoading(true);
		const amount = cart.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);

		const orderData = {
			...formData,
			cartItems: cart,
			jumlahBayar: amount,
		};

		try {
			const response = await fetch("/api/midtrans", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderData),
			});

			const data = await response.json();

			if (data.token && data.orderId) {
				window.snap.pay(data.token, {
					onSuccess: async function (result) {
						try {
							clearCart();

							await axios.put(
								"/api/checkout",
								{
									orderId: data.orderId, // Menggunakan orderId dari respons
									status: "sudah bayar",
								},
								{
									headers: {
										Authorization: `Bearer ${session.accessToken}`,
									},
								}
							);
							toast({
								title: "Success",
								description: `${product.name}  has been added to your cart`,
								duration: 1000,
								variant: "gray",
							});
							router.push("/dashboard");
						} catch (error) {
							console.error("Error updating order status:", error);
						}
					},
					onPending: function (result) {
						toast({
							title: "Pending",
							description: `Pembayaran pending`,
							duration: 1000,
							variant: "gray",
						});
						clearCart();
						router.push("/dashboard");
					},
					onError: function (result) {
						toast({
							title: "Error",
							description: `Pembayaran Error`,
							duration: 1000,
							variant: "gray",
						});

						clearCart();
						router.push("/dashboard");
					},
					onClose: function () {
						toast({
							title: "Pembayaran belum selesai",
							description: `Pembayaran belum selesai`,
							duration: 1000,
							variant: "gray",
						});
						console.log("Snap modal closed without finishing the payment");
						router.push("/dashboard");
						clearCart();
					},
				});
			} else {
				console.error("No token or orderId received from Midtrans");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
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

	const handleNextStep = () => {
		if (status === "unauthenticated") {
			router.push("/login");
		} else {
			setCheckoutStep(2);
		}
	};

	return (
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<div className='container mx-auto px-4'>
				<h1 className='text-2xl font-bold mb-5'>Keranjang Belanja</h1>
				{checkoutStep === 1 ? (
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='w-full md:w-5/5'>
							{cart.length > 0 ? (
								cart.map((item, index) => (
									<div
										key={index}
										className='bg-white p-5 rounded-lg shadow-md mb-5 flex flex-col md:flex-row items-center'
									>
										<img
											src={item.imageUrl}
											alt={item.name}
											className='w-24 h-24 object-cover rounded-lg mb-4 md:mb-0 md:mr-5'
										/>
										<div className='flex-1 text-center md:text-left'>
											<h2 className='text-lg font-semibold'>{item.name}</h2>
											<p>Jumlah: {item.quantity}</p>
											<p>Price: Rp{item.price.toLocaleString()}</p>
										</div>
										<button
											onClick={() => removeFromCart(item.id)}
											className='bg-black text-white p-2 hover:bg-red-600 mt-4 md:mt-0 ml-0 md:ml-5 rounded-md'
										>
											Kurangi jumlah
										</button>
									</div>
								))
							) : (
								<div>
									<p className='text-lg font-semibold text-center justify-center'>
										Keranjang Anda kosong. Mulai berbelanja{" "}
										<Link href='/products' className='block hover:underline'>
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
								<div className='mb-2'>
									<label className='block text-sm font-medium text-gray-700'>
										Total
									</label>
									<input
										type='text'
										readOnly
										value={`Rp ${totalAmount.toLocaleString()}`}
										className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white p-4 text-lg h-12'
									/>
								</div>
								<button
									className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'
									onClick={handleNextStep} // Ganti fungsi handleNextStep sesuai kebutuhan
								>
									Submit
								</button>
							</div>
						)}
					</div>
				) : (
					<form
						onSubmit={handleCheckout}
						className='bg-white p-6 rounded-lg shadow-md'
					>
						<h2 className='text-lg font-semibold mb-4'>Data Diri</h2>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700'>
								Nama
							</label>
							<input
								type='text'
								name='name'
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 p-4 text-lg h-12'
								required
							/>
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								readOnly
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 p-4 text-lg h-12'
								required
							/>
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700'>
								Alamat
							</label>
							<textarea
								name='address'
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 p-4 text-lg h-12'
								required
							/>
						</div>
						<div className='mb-4'>
							<label className='block text-sm font-medium text-gray-700'>
								Telepon
							</label>
							<input
								type='text'
								name='phone'
								value={formData.phone}
								onChange={(e) =>
									setFormData({ ...formData, phone: e.target.value })
								}
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 p-4 text-lg h-12'
								required
							/>
						</div>
						<button
							type='submit'
							disabled={loading} // Disable button saat loading
							className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'
						>
							{loading ? <Spinner /> : "Checkout"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default Keranjang;
