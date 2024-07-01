import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminDashboard, AdminLayout } from "../AdminLayout";
import NewProductModal from "./modal/ModalProduct";
import axios from "axios";

export default function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

	// Function to fetch products
	const fetchProducts = async () => {
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
		fetchProducts();
	}, []);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		// Fetch products again after closing modal to update data
		fetchProducts();
	};

	const editProduct = async (productId) => {
		// Implement edit product functionality here
		// Redirect or open modal for editing
		console.log("Edit product with ID:", productId);
	};

	const deleteProduct = async (productId) => {
		try {
			const confirmDelete = window.confirm(
				"Are you sure you want to delete this product?"
			);
			if (confirmDelete) {
				const response = await axios.delete(
					`/api/product/deleteproduct/${productId}`
				);
				if (response.data.success) {
					fetchProducts(); // Fetch products again to update list
				} else {
					console.error("Failed to delete product:", response.data.error);
				}
			}
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	return (
		<AdminLayout>
			<div>
				<div>
					<Button onClick={openModal} className='mb-4'>
						Add New Product
					</Button>
				</div>

				{loading ? (
					<div>
						<p className='text-center'>Loading...</p>
					</div>
				) : (
					<div>
						<div className='overflow-x-auto'>
							<table className='min-w-full bg-white'>
								<thead>
									<tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
										<th className='py-3 px-6 text-left'>Image</th>
										<th className='py-3 px-6 text-left'>Name</th>
										<th className='py-3 px-6 text-left'>Category</th>
										<th className='py-3 px-6 text-left'>Price</th>
										<th className='py-3 px-6 text-left'>Stock</th>
										<th className='py-3 px-6 text-left'>Description</th>
										<th className='py-3 px-6 text-left'>action</th>
									</tr>
								</thead>
								<tbody className='text-gray-600 text-sm font-light'>
									{products.map((product) => (
										<tr
											key={product._id}
											className='border-b border-gray-200 hover:bg-gray-100'
										>
											<td className='py-3 px-6 text-left'>
												{product.images.length > 0 && (
													<img
														src={product.images[0]}
														alt='Product image'
														style={{
															width: "4rem",
															height: "4rem",
															objectFit: "cover",
														}}
													/>
												)}
											</td>
											<td className='py-3 px-6 text-left'>{product.name}</td>
											<td className='py-3 px-6 text-left'>
												{product.category}
											</td>
											<td className='py-3 px-6 text-left'>{product.price}</td>
											<td className='py-3 px-6 text-left'>{product.stock}</td>
											<td className='py-3 px-6 text-left'>
												{product.description}
											</td>
											<td className='py-3 px-6 text-left'>
												<div className='flex flex-col sm:flex-row lg:flex-col lg:items-start'>
													<Button
														onClick={() => editProduct(product._id)}
														className='w-full sm:w-1/2 lg:w-full mr-0 sm:mr-2 lg:mr-0 mb-2 sm:mb-0 lg:mb-2 hover:bg-yellow-500'
													>
														Edit
													</Button>
													<Button
														onClick={() => deleteProduct(product._id)}
														className='w-full sm:w-1/2 lg:w-full hover:bg-red-500'
													>
														Delete
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
				<NewProductModal isOpen={isModalOpen} onClose={closeModal} />
			</div>
		</AdminLayout>
	);
}
