import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductsAll() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [priceRange, setPriceRange] = useState([0, 100000000]);
	const [sortOrder, setSortOrder] = useState("a-z");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 2;

	const dataProduct = async () => {
		try {
			const response = await fetch("/api/product/getproduct");
			const data = await response.json();
			setProducts(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching data:", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		dataProduct();
	}, []);

	const handlePriceRangeChange = (e) => {
		const value = e.target.value;
		if (value === "0-50k") {
			setPriceRange([0, 50000]);
		} else if (value === "50k-100k") {
			setPriceRange([50000, 100000]);
		} else if (value === "100k-500k") {
			setPriceRange([100000, 500000]);
		} else if (value === "500k+") {
			setPriceRange([500000, 100000000]);
		} else {
			setPriceRange([0, 100000000]);
		}
	};

	const handleSortOrderChange = (e) => {
		setSortOrder(e.target.value);
	};

	const filteredProducts = products
		.filter(
			(product) =>
				product.price >= priceRange[0] && product.price <= priceRange[1]
		)
		.sort((a, b) => {
			if (sortOrder === "a-z") {
				return a.name.localeCompare(b.name);
			} else {
				return b.name.localeCompare(a.name);
			}
		});

	// Calculate pagination
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredProducts.slice(
		indexOfFirstItem,
		indexOfLastItem
	);

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className='mx-auto'>
			<div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
				<div className='flex items-center justify-between'>
					<h2 className='mt-12 text-2xl font-bold tracking-tight text-gray-900'>
						Our Products
					</h2>
					<div className='flex flex-col sm:flex-row gap-4'>
						<select
							onChange={handlePriceRangeChange}
							className='border p-2 rounded'
						>
							<option value='all'>All Prices</option>
							<option value='0-50k'>Rp0 - Rp50,000</option>
							<option value='50k-100k'>Rp50,000 - Rp100,000</option>
							<option value='100k-500k'>Rp100,000 - Rp500,000</option>
							<option value='500k+'>Rp500,000+</option>
						</select>
						<select
							onChange={handleSortOrderChange}
							className='border p-2 rounded'
						>
							<option value='a-z'>Sort A-Z</option>
							<option value='z-a'>Sort Z-A</option>
						</select>
					</div>
				</div>

				<div className='mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
					{loading
						? Array.from({ length: 8 }, (_, index) => (
								<div key={index} className='group relative'>
									<div className='aspect-square w-full overflow-hidden rounded-md bg-gray-200 animate-pulse group-hover:opacity-75 lg:h-80'>
										<Skeleton className='h-full w-full object-cover object-center lg:h-full lg:w-full' />
									</div>
									<div className='mt-4 flex justify-between'>
										<div>
											<Skeleton className='h-6 w-3/4' />
											<Skeleton className='h-4 w-1/2 mt-1' />
										</div>
										<Skeleton className='h-6 w-1/4' />
									</div>
								</div>
						  ))
						: currentItems.map((product) => (
								<div key={product._id} className='group relative'>
									<div className='border-4 border-black aspect-square w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-80'>
										<Link href={`/product/${product.slug}`}>
											{product.images.map((image, index) => (
												<Image
													key={index}
													src={image}
													alt='Product image'
													className='h-full w-full object-cover object-center lg:h-full lg:w-full'
													width={300}
													height={300}
												/>
											))}
										</Link>
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
											Rp{product.price}
										</p>
									</div>
								</div>
						  ))}
				</div>
			</div>
			<Pagination>
				<PaginationContent>
					{Array.from({ length: totalPages }, (_, index) => (
						<PaginationItem key={index}>
							<Link href={`?page=${index + 1}`} passHref>
								<PaginationLink onClick={() => paginate(index + 1)}>
									{index + 1}
								</PaginationLink>
							</Link>
						</PaginationItem>
					))}
					<PaginationItem>
						<Link href={`?page=${currentPage + 1}`} passHref>
							<PaginationNext
								onClick={() =>
									setCurrentPage((prevPage) =>
										prevPage < totalPages ? prevPage + 1 : totalPages
									)
								}
							/>
						</Link>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
