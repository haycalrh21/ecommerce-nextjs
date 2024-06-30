// pages/product/[slug].js

import ImageGallery from "@/components/ImageGallery";
import { Star, Truck } from "lucide-react";
import React from "react";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/cartContext";

export default function DetailProduct({ product }) {
	const { addToCart } = useCart();
	const router = useRouter();

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	const handleAddToCart = () => {
		addToCart({
			id: product._id,
			name: product.name,
			price: product.price,
			imageUrl: product.images[0],
			quantity: 1,
			slug: product.slug,
		});
	};

	return (
		<>
			<div className='bg-white'>
				<div className='mx-auto max-w-screen-xl px-4 md:px-8'>
					<div className='grid gap-8 md:grid-cols-2'>
						<ImageGallery images={product.images} />

						<div className='md:py-8 mt-12'>
							<div className='mb-2 md:mb-3'>
								<span className='mb-0.5 inline-block text-gray-500'>
									{product.category}
								</span>
								<h2 className='text-2xl font-bold text-gray-800 lg:text-3xl'>
									{product.name}
								</h2>
							</div>

							<div className='mb-4'>
								<div className='flex items-end gap-2'>
									<span className='text-xl font-bold text-gray-800 md:text-2xl'>
										Rp{product.price.toLocaleString("id-ID")}
									</span>
								</div>

								<div className='mt-4'>
									{/* ukuran */}
									<button className=' bg-black mr-2 duration-200 flex place-items-center justify-center rounded-full w-12 h-12 cursor-pointer hover:bg-cusblack hover:text-white'></button>
								</div>
							</div>

							<div className='mb-6 flex items-center gap-2 text-gray-500'>
								<Truck className='h-6 w-6' />
								<span className='text-sm'>2-4 Day Shipping</span>
							</div>
							<div className='flex gap-2.5'>
								<button
									className='w-full h-12 rounded-md bg-zinc-500 text-2xl font-medium text-white'
									onClick={() => handleAddToCart()}
								>
									add to cart
								</button>
								<button className='w-full rounded-md bg-orange-500 text-2xl font-medium text-white'>
									buy now
								</button>
							</div>
							<p className='mt-12 text-base tracking-wide text-gray-500'>
								{product.description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export async function getStaticPaths() {
	try {
		const res = await fetch("/api/product/getproduct");
		const products = await res.json();

		const paths = products.map((product) => ({
			params: { slug: product.slug },
		}));

		return {
			paths,
			fallback: true,
		};
	} catch (error) {
		console.error("Error fetching products:", error);
		return {
			paths: [],
			fallback: true,
		};
	}
}

export async function getStaticProps({ params }) {
	try {
		const res = await fetch(`/api/product/${params.slug}`);
		const product = await res.json();

		return {
			props: { product },
			revalidate: 60,
		};
	} catch (error) {
		console.error("Error fetching product:", error);
		return {
			props: { product: null },
			revalidate: 60,
		};
	}
}
