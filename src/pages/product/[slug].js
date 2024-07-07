import ImageGallery from "@/components/ImageGallery";
import { Star, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/cartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner/Spinner";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function DetailProduct() {
	const { data: session } = useSession();

	const { addToCart } = useCart();
	const router = useRouter();
	const { slug } = router.query;
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		if (slug) {
			setLoading(true);
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

	const handleAddToWishlist = async () => {
		// setLoading(true);
		if (!session || !session.user) {
			router.push("/login");
			return;
		}
		try {
			const response = await fetch("/api/wishlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: session.user._id,
					productId: product._id,
				}),
			});
			if (response.ok) {
				toast({
					title: "Success",
					description: `${product.name} has been added to your wishlist`,
					duration: 1000,
					variant: "gray",
				});
			} else {
				throw new Error("Failed to add product to wishlist");
			}
		} catch (error) {
			console.error("Error adding product to wishlist:", error);
			toast({
				title: "Sudah masuk wishlist",
				description: "sudah ada di dalam  wishlist",
				duration: 1000,
				variant: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleAddToCart = () => {
		setLoading(true);
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
			description: `${product.name} has been added to your cart`,
			duration: 1000,
			variant: "gray",
		});
		setLoading(false);
	};

	return (
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
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5 }}
							>
								<ImageGallery images={product.images} />
							</motion.div>
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
								</div>
								<div className='mb-6 flex items-center gap-2 text-gray-500'>
									<Truck className='h-6 w-6' />
									<span className='text-sm'>2-4 Day Shipping</span>
								</div>
								<div className='flex gap-2.5'>
									<Button
										disabled={loading}
										className='w-full h-10 mb-8 sm:w-full md:w-1/2 lg:w-1/7 flex flex-col justify-center items-center rounded-md  text-2xl font-medium text-white hover:bg-[#666766]'
										onClick={handleAddToCart}
									>
										{loading ? <Spinner /> : "Add To Cart"}
									</Button>
								</div>
								<div className='flex gap-1'>
									<Button
										disabled={loading}
										className='w-full h-10 mb-8 sm:w-full md:w-1/2 lg:w-1/7 flex justify-center items-center rounded-md text-xl md:text-2xl font-medium text-white bg-red-700 hover:bg-gray-600'
										onClick={handleAddToWishlist}
									>
										{loading ? <Spinner /> : "Add To Wishlist"}
									</Button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
