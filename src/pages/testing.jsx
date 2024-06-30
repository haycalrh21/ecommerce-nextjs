import React, { useEffect, useState } from "react";

export default function Testing() {
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
		<div className='mt-20'>
			{products.map((product) => (
				<div
					key={product._id}
					className='mb-5 p-4 border border-gray-300 rounded-md'
				>
					<h1 className='text-lg font-bold'>{product.name}</h1>
					<p className='text-sm text-gray-600'>Category: {product.category}</p>
					<p className='text-sm text-gray-600'>Slug: {product.slug}</p>
					<p className='text-sm text-gray-600'>Price: ${product.price}</p>
					<p className='text-sm text-gray-600'>Stock: {product.stock}</p>
					<div className='mt-2'>
						{product.images.map((image, index) => (
							<img
								key={index}
								src={image}
								alt={product.name}
								className='w-20 h-20 object-cover'
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
