import { useCart } from "@/hooks/cartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Keranjang = () => {
	const { data: session } = useSession();
	const { cart, removeFromCart, clearCart } = useCart();
	const [checkoutStep, setCheckoutStep] = useState(1);
	const router = useRouter();
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
		e.preventDefault(); // Hindari pengiriman form secara default

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

			if (data.token) {
				window.snap.pay(data.token, {
					onSuccess: function (result) {
						console.log(result);
						clearCart();
						router.push("/dashboard");
					},
					onPending: function (result) {
						console.log(result);
						clearCart();
						router.push("/dashboard");
					},
					onError: function (result) {
						console.error(result);
						clearCart();
						router.push("/dashboard");
					},
					onClose: function () {
						router.push("/dashboard");
						clearCart();

						console.log("Snap modal closed without finishing the payment");
					},
				});
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
		// Logika untuk langkah selanjutnya dalam proses pembelian
		// Misalnya, menampilkan formulir pengiriman atau konfirmasi pembelian
		setCheckoutStep(2); // Contoh: Mengubah langkah checkout ke 2
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
											className='bg-black text-white p-2 hover:bg-red-600 ml-5 rounded-md'
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
										Jumlah Bayar
									</label>
									<input
										type='text'
										readOnly
										value={`Rp ${totalAmount.toLocaleString()}`}
										className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100'
									/>
								</div>
								<button
									className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'
									onClick={handleNextStep} // Ganti fungsi handleNextStep sesuai kebutuhan
								>
									Checkout
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
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
								className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								required
							/>
						</div>
						<button
							type='submit'
							className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600'
						>
							Submit
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default Keranjang;
