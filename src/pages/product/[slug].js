// pages/product/[slug].js

import ImageGallery from "@/components/ImageGallery";
import { Star, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/cartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function DetailProduct() {
	const { addToCart } = useCart();
	const router = useRouter();
	const { slug } = router.query;
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		if (slug) {
			fetch(`/api/product/${slug}`)
				.then((res) => res.json())
				.then((data) => {
					setProduct(data);
					setLoading(false);
				})
				.catch((error) => {
					console.error("Error fetching product:", error);
					setLoading(false);
				});
		}
	}, [slug]);

	const handleAddToCart = () => {
		addToCart({
			id: product._id,
			name: product.name,
			price: product.price,
			imageUrl: product.images[0],
			quantity: 1,
			slug: product.slug,
		});
		toast({
			title: "Success",
			description: `${product.name}  has been added to your cart`,
			duration: 3000,
			variant: "success",
			descripton: `href='/keranjang'`,
		});
	};

	return (
		<>
			<div>
				<div className='mx-auto max-w-screen-xl px-4 md:px-8'>
					<div className='grid gap-8 md:grid-cols-2'>
						{loading ? (
							<div className='animate-pulse flex space-x-4'>
								<div className='w-full'>
									<Skeleton className='h-96 w-full rounded-lg' />
								</div>
								<div className='w-full'>
									<div className='space-y-4'>
										<Skeleton className='h-6 w-1/2' />
										<Skeleton className='h-6 w-3/4' />
										<Skeleton className='h-6 w-1/3' />
										<Skeleton className='h-6 w-2/3' />
										<Skeleton className='h-6 w-1/2' />
										<Skeleton className='h-6 w-4/5' />
									</div>
								</div>
							</div>
						) : (
							<>
								<ImageGallery images={product.images} />

								<div className='md:py-8 mt-12'>
									<div className='mb-2 md:mb-3'>
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

										<p className='mt-12 text-base tracking-wide text-gray-500'>
											{product.description}
										</p>
										{/* ukuran */}
										{/* <div className='mt-4'>
											<button className=' bg-black mr-2 duration-200 flex place-items-center justify-center rounded-full w-12 h-12 cursor-pointer hover:bg-cusblack hover:text-white'></button>
										</div> */}
									</div>

									<div className='mb-6 flex items-center gap-2 text-gray-500'>
										<Truck className='h-6 w-6' />
										<span className='text-sm'>2-4 Day Shipping</span>
									</div>

									<div className='flex gap-2.5'>
										<button
											className='w-full h-10 sm:w-full md:w-1/2 lg:w-1/7 flex flex-col justify-center items-center rounded-md bg-[#2F3645] text-2xl font-medium text-white hover:bg-[#666766]'
											onClick={() => handleAddToCart()}
										>
											add to cart
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
