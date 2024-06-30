import { useState } from "react";
import axios from "axios";

export default function NewProduct() {
	const [formData, setFormData] = useState({
		name: "",
		category: "",
		slug: "",
		price: "",
		stock: "",
		images: [],
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		// Jika yang berubah adalah 'name', update juga nilai 'slug'
		if (name === "name") {
			const slugValue = value.trim().toLowerCase().replace(/\s+/g, "-"); // Buat slug dari nilai nama
			setFormData({ ...formData, [name]: value, slug: slugValue });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		setFormData({ ...formData, images: files });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
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
			console.log(res.data);
			// Reset form fields after successful submission
			setFormData({
				name: "",
				category: "",
				slug: "",
				price: "",
				stock: "",
				images: [],
			});
		} catch (error) {
			console.error(error.response.data);
		}
	};

	return (
		<div className='max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg'>
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
				<button
					type='submit'
					className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
				>
					Submit
				</button>
			</form>
		</div>
	);
}
