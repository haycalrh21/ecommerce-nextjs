import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewProduct() {
	const [products, setProducts] = useState([]);

	const dataProduct = async () => {
		try {
			const response = await fetch("/api/product/getproduct");
			const data = await response.json();
			setProducts(data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		dataProduct();
	}, []);

	return (
		<div className='bg-white'>
			<div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold tracking-tight text-gray-900'>
						Produk Terbaru Kami
					</h2>
					<Link
						className='flex items-center gap-x-1 text-primary'
						href='/products'
					>
						Lihat Semua <span>-.</span>
					</Link>
				</div>

				<div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
					{products.map((product) => (
						<div key={product._id} className='group relative'>
							<div className='aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80'>
								<Link href={`/product/${product.slug}`}>
									{product.images.length > 0 && (
										<img
											src={product.images[0]}
											alt={product.name}
											className='w-full h-full object-cover'
										/>
									)}
								</Link>
							</div>
							<div className='mt-4 flex justify-between'>
								<div>
									<h3 className='text-sm text-gray-700 hover:underline'>
										<Link href={`/product/${product.slug}`}>
											{product.name}
										</Link>
									</h3>
									<p className='mt-1 text-sm text-gray-500'>
										{product.category}
									</p>
								</div>
								<p className='text-sm font-medium text-gray-900'>
									Rp{product.price.toLocaleString("id-ID")}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
