import React, { useState } from "react";
import axios from "axios";
import Spinner from "@/components/ui/spinner/Spinner";

export default function NewProductModal({ isOpen, onClose }) {
	const [formData, setFormData] = useState({
		name: "",
		category: "",
		slug: "",
		price: "",
		stock: "",
		description: "",
		images: [],
	});

	const [imagePreviews, setImagePreviews] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "name") {
			const slugValue = value.trim().toLowerCase().replace(/\s+/g, "-");
			setFormData({ ...formData, [name]: value, slug: slugValue });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		setFormData({ ...formData, images: files });

		const previews = files.map((file) => URL.createObjectURL(file));
		setImagePreviews(previews);
	};

	const handleCancelImage = (index) => {
		const updatedPreviews = [...imagePreviews];
		updatedPreviews.splice(index, 1);
		setImagePreviews(updatedPreviews);

		const updatedImages = [...formData.images];
		updatedImages.splice(index, 1);
		setFormData({ ...formData, images: updatedImages });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // Set loading true saat mulai submit

		const imagesBase64 = await Promise.all(
			formData.images.map((file) => {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => resolve(reader.result);
					reader.onerror = (error) => reject(error);
				});
			})
		);

		try {
			const res = await axios.post("/api/product", {
				...formData,
				images: imagesBase64,
			});
			// console.log(res.data);
			setFormData({
				name: "",
				category: "",
				slug: "",
				price: "",
				stock: "",
				description: "",
				images: [],
			});
			setImagePreviews([]);
			setLoading(false); // Set loading false setelah sukses submit
			onClose(); // Tutup modal setelah pengiriman berhasil
		} catch (error) {
			setLoading(false); // Set loading false jika terjadi error
			console.error(error.response.data);
			setError("Error during product submission. Please try again.");
		}
	};

	return (
		<div
			className={`fixed inset-0 z-10 overflow-y-auto ${isOpen ? "" : "hidden"}`}
		>
			<div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
				<div className='fixed inset-0 transition-opacity' aria-hidden='true'>
					<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
				</div>

				<span
					className='hidden sm:inline-block sm:align-middle sm:h-screen'
					aria-hidden='true'
				>
					&#8203;
				</span>

				<div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
					<div>
						<div className='text-center sm:mt-5'>
							<h3 className='text-lg leading-6 font-medium text-gray-900'>
								Add New Product
							</h3>
						</div>
						<div className='mt-2'>
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div>
									<label
										htmlFor='name'
										className='block text-sm font-medium text-gray-700'
									>
										Name
									</label>
									<input
										id='name'
										name='name'
										type='text'
										placeholder='Enter product name'
										value={formData.name}
										onChange={handleChange}
										required
										className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
									/>
								</div>
								<div>
									<label
										htmlFor='category'
										className='block text-sm font-medium text-gray-700'
									>
										Category
									</label>
									<input
										id='category'
										name='category'
										type='text'
										placeholder='Enter category'
										value={formData.category}
										onChange={handleChange}
										required
										className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
									/>
								</div>
								<div>
									<label
										htmlFor='slug'
										className='block text-sm font-medium text-gray-700'
									>
										Slug
									</label>
									<input
										id='slug'
										name='slug'
										type='text'
										placeholder='Auto-generated slug'
										value={formData.slug}
										onChange={handleChange}
										readOnly
										className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100'
									/>
								</div>
								<div>
									<label
										htmlFor='price'
										className='block text-sm font-medium text-gray-700'
									>
										Price
									</label>
									<input
										id='price'
										name='price'
										type='number'
										placeholder='Enter price'
										value={formData.price}
										onChange={handleChange}
										required
										className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
									/>
								</div>
								<div>
									<label
										htmlFor='stock'
										className='block text-sm font-medium text-gray-700'
									>
										Stock
									</label>
									<input
										id='stock'
										name='stock'
										type='number'
										placeholder='Enter stock'
										value={formData.stock}
										onChange={handleChange}
										required
										className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
									/>
								</div>
								<div>
									<label
										htmlFor='Description'
										className='block text-sm font-medium text-gray-700'
									>
										Description
									</label>
									<textarea
										id='description'
										name='description'
										type='text'
										placeholder='Enter description'
										value={formData.description}
										onChange={handleChange}
										required
										className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
									/>
								</div>
								<div>
									<label
										htmlFor='images'
										className='block text-sm font-medium text-gray-700'
									>
										Images
									</label>
									<input
										id='images'
										name='images'
										type='file'
										multiple
										onChange={handleFileChange}
										required
										className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
									/>
								</div>
								{/* Menampilkan pratinjau gambar */}
								<div className='grid grid-cols-3 gap-4 mt-4'>
									{imagePreviews.map((preview, index) => (
										<div key={index} className='relative'>
											<img
												src={preview}
												alt={`Product Preview ${index}`}
												className='h-24 w-full object-cover rounded-md'
											/>
											<button
												type='button'
												className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
												onClick={() => handleCancelImage(index)}
											>
												Cancel
											</button>
										</div>
									))}
								</div>
								{/* Tombol Submit */}
								<button
									type='submit'
									disabled={loading}
									className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
										loading
											? "bg-gray-400 cursor-not-allowed"
											: "bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
									}`}
								>
									{loading ? <Spinner /> : "Submit"}
								</button>
							</form>
							{error && (
								<div className='text-red-500 text-sm mt-2'>{error}</div>
							)}
						</div>
					</div>
					{/* Tombol Cancel */}
					<div className='mt-5 sm:mt-6'>
						<button
							type='button'
							className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm'
							onClick={onClose}
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
