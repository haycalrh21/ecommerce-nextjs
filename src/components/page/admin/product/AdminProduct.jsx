import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminDashboard } from "../AdminLayout";
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
		<AdminDashboard>
			<div>
				<div>
					<h2>Our Products</h2>
					<Button onClick={openModal}>Add New Product</Button>
				</div>

				{loading ? (
					<div>
						<p>Loading...</p>
					</div>
				) : (
					<div>
						<div>
							<table>
								<thead>
									<tr>
										<th>Image</th>
										<th>Name</th>
										<th>Category</th>
										<th>Price</th>
										<th>Stock</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{products.map((product) => (
										<tr key={product._id}>
											<td>
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
											<td>{product.name}</td>
											<td>{product.category}</td>
											<td>Rp{product.price}</td>
											<td>{product.stock}</td>
											<td>
												<Button onClick={() => editProduct(product._id)}>
													Edit
												</Button>
												<Button onClick={() => deleteProduct(product._id)}>
													Delete
												</Button>
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
		</AdminDashboard>
	);
}
