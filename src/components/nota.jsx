import React from "react";

const Nota = ({ order }) => {
	const formatToLocalTime = (utcDateString) => {
		const options = {
			timeZone: "Asia/Jakarta",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(utcDateString).toLocaleDateString("id-ID", options);
	};

	return (
		<div className='container mx-auto p-4 md:p-8 bg-white shadow-md'>
			<h2 className='text-xl md:text-2xl font-bold mb-4'>Invoice</h2>

			<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
				<div className='mb-4 md:mb-0'>
					<p className='font-semibold'>Penjual</p>
					<p className='text-sm'>Toko Xyz</p>
				</div>
				<div className='text-left md:text-right'>
					<p className='font-semibold'>Pembayaran</p>
					<p className='text-sm'>Midtrans</p>
				</div>
			</div>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-4'>
				<div className='mb-4 md:mb-0'>
					<p className='font-semibold'>ID Order</p>
					<p className='text-sm'>{order._id}</p>
				</div>
				<div className='text-left md:text-right'>
					<p className='font-semibold'>Tanggal</p>
					<p className='text-sm'>{formatToLocalTime(order.createdAt)}</p>
				</div>
			</div>
			<table className='min-w-full bg-white'>
				<thead>
					<tr>
						<th className='py-2 px-2 md:px-4 text-left'>Nama Produk</th>
						<th className='py-2 px-2 md:px-4 text-left'>Jumlah Barang</th>
						<th className='py-2 px-2 md:px-4 text-left'>Harga Barang</th>
						<th className='py-2 px-2 md:px-4 text-left'>Subtotal</th>
					</tr>
				</thead>
				<tbody>
					{order.cartItems.map((item, index) => (
						<tr key={index} className='border-b'>
							<td className='py-2 px-2 md:px-4'>{item.name}</td>
							<td className='py-2 px-2 md:px-4'>{item.quantity}</td>
							<td className='py-2 px-2 md:px-4'>
								Rp {item.price.toLocaleString("id-ID")}
							</td>
							<td className='py-2 px-2 md:px-4'>
								Rp {(item.price * item.quantity).toLocaleString("id-ID")}
							</td>
						</tr>
					))}
					<tr className='font-bold'>
						<td className='py-2 px-2 md:px-4 text-right' colSpan='3'>
							Subtotal
						</td>
						<td className='py-2 px-2 md:px-4'>
							Rp{" "}
							{order.cartItems
								.reduce((acc, item) => acc + item.price * item.quantity, 0)
								.toLocaleString("id-ID")}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Nota;
