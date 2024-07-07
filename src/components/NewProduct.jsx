import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function NewProduct() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const router = useRouter();

	const dataProduct = async () => {
		try {
			const response = await fetch("/api/product/getproduct");
			const data = await response.json();

			// Filter produk yang memiliki properti `createdAt`
			const filteredProducts = data.filter((product) => product.createdAt);

			// Lakukan pengurutan berdasarkan properti `createdAt` jika tersedia
			const sortedProducts = filteredProducts.sort(
				(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			);

			// Batasi hanya 4 produk yang ditampilkan
			const limitedProducts = sortedProducts.slice(0, 4);

			setProducts(limitedProducts);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		dataProduct();
	}, []);

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
	};

	const popUpVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
		exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
	};

	return (
		<div>
			<motion.div
				className='mx-auto mb-20 max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'
				initial='hidden'
				animate='show'
				variants={containerVariants}
			>
				<motion.div
					className='flex items-center justify-between'
					variants={itemVariants}
				>
					<h2 className='mb-50 text-2xl font-bold tracking-tight text-gray-900'>
						New Our Products
					</h2>
					<Link
						className='flex items-center gap-x-1 text-primary'
						href='/products'
					>
						Check this out <span>-&gt;</span>
					</Link>
				</motion.div>

				<motion.div
					className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 cursor-pointer'
					variants={containerVariants}
				>
					{loading
						? Array.from({ length: 8 }).map((_, index) => (
								<motion.div
									key={index}
									className='group relative'
									variants={itemVariants}
								>
									<Skeleton className='aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:h-80' />
									<div className='mt-4 flex justify-between'>
										<div className='space-y-2'>
											<Skeleton className='h-4 w-24' />
											<Skeleton className='h-4 w-16' />
										</div>
										<Skeleton className='h-4 w-12' />
									</div>
								</motion.div>
						  ))
						: products.map((product) => (
								<motion.div
									key={product._id}
									className='group relative'
									variants={itemVariants}
									onClick={() => setSelectedProduct(product)}
								>
									<div className='border-4 border-black aspect-square w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-80'>
										{product.images.length > 0 && (
											<img
												src={product.images[0]}
												alt={product.name}
												className='w-full h-full object-cover'
											/>
										)}
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
								</motion.div>
						  ))}
				</motion.div>
			</motion.div>

			<AnimatePresence>
				{selectedProduct && (
					<motion.div
						className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
						variants={popUpVariants}
						initial='hidden'
						animate='show'
						exit='exit'
						onClick={() => setSelectedProduct(null)}
					>
						<motion.div
							className='bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto'
							variants={popUpVariants}
							onClick={(e) => e.stopPropagation()}
						>
							<h3 className='text-lg font-bold'>{selectedProduct.name}</h3>
							<img
								src={selectedProduct.images[0]}
								alt={selectedProduct.name}
								className='mt-4 w-full h-auto max-h-96 object-contain'
							/>
							<p className='mt-4'>
								{selectedProduct.description.length > 100 ? (
									<>
										{selectedProduct.description.substring(0, 100)}...
										<span
											className='text-primary cursor-pointer'
											onClick={() =>
												setSelectedProduct({
													...selectedProduct,
													description: selectedProduct.description,
												})
											}
										>
											Lihat lebih
										</span>
									</>
								) : (
									selectedProduct.description
								)}
							</p>
							<button
								className='mt-4 bg-primary text-white py-2 px-4 rounded'
								onClick={() => router.push(`/product/${selectedProduct.slug}`)}
							>
								Lihat Detail
							</button>
							<button
								className='mt-4 bg-primary bg-red-500 text-white py-2 px-4 rounded block'
								onClick={() => setSelectedProduct(null)}
							>
								Close
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
