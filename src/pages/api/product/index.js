import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import db from "@/lib/mongodb";

export default async function handler(req, res) {
	await db.connect();

	if (req.method === "POST") {
		// Handle product creation
		const { name, category, slug, price, stock, images, description } =
			req.body;

		try {
			const uploadResponses = await Promise.all(
				images.map((image) =>
					cloudinary.uploader.upload(image, { folder: "products" })
				)
			);
			const imageUrls = uploadResponses.map((response) => response.secure_url);

			const product = new Product({
				name,
				category,
				slug,
				price,
				stock,
				description,
				images: imageUrls,
			});
			await product.save();
			res.status(201).json({ success: true, data: product });
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	} else if (req.method === "PUT") {
		// Handle product update
		const { id } = req.query;
		const { name, category, slug, price, stock, images } = req.body;

		try {
			let updatedProduct = await Product.findById(id);

			if (!updatedProduct) {
				return res
					.status(404)
					.json({ success: false, message: "Product not found" });
			}

			// If images are provided, upload them to Cloudinary and update imageUrls
			if (images && images.length > 0) {
				const uploadResponses = await Promise.all(
					images.map((image) =>
						cloudinary.uploader.upload(image, { folder: "products" })
					)
				);
				const imageUrls = uploadResponses.map(
					(response) => response.secure_url
				);
				updatedProduct.images = imageUrls;
			}

			// Update other fields
			updatedProduct.name = name;
			updatedProduct.category = category;
			updatedProduct.slug = slug;
			updatedProduct.price = price;
			updatedProduct.stock = stock;

			await updatedProduct.save();
			res.status(200).json({ success: true, data: updatedProduct });
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	} else if (req.method === "DELETE") {
		// Handle product deletion
		const { id } = req.query;

		try {
			const deletedProduct = await Product.findById(id);

			if (!deletedProduct) {
				return res
					.status(404)
					.json({ success: false, message: "Product not found" });
			}

			// Delete images from Cloudinary
			await Promise.all(
				deletedProduct.images.map(async (imageUrl) => {
					const publicId = imageUrl.split("/products/")[1].split(".")[0];
					await cloudinary.uploader.destroy(publicId);
				})
			);

			await deletedProduct.remove();
			res
				.status(200)
				.json({ success: true, message: "Product deleted successfully" });
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	} else {
		res.status(405).json({ success: false, message: "Method not allowed" });
	}
}
