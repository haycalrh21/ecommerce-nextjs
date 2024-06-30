import React from "react";
import { products } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function productsAll() {
	return (
		<>
			<div className='bg-white '>
				<div className='mx-auto max-w-2xl px-4 sm:px-6  lg:max-w-7xl lg:px-8 '>
					<div className=' flex items-center justify-between'>
						<h2 className='mt-12 text-2xl font-bold tracking-tight text-gray-900'>
							Our Products
						</h2>
					</div>

					<div className='mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
						{products.map((product) => (
							<div key={product._id} className='group relative'>
								<div className='aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80'>
									<Image
										src={product.imageUrl}
										alt='Product image'
										className='h-full w-full object-cover object-center lg:h-full lg:w-full'
										width={300}
										height={300}
									/>
								</div>

								<div className='mt-4 flex justify-between'>
									<div>
										<h3 className='text-sm text-gray-700'>
											<Link href={`/product/${product.slug}`}>
												{product.name}
											</Link>
										</h3>
										<p className='mt-1 text-sm text-gray-500'>
											{product.categoryName}
										</p>
									</div>
									<p className='text-sm font-medium text-gray-900'>
										${product.price}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}