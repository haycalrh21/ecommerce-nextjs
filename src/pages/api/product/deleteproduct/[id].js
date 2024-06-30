// pages/api/deleteProduct/[id].js

import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import db from "@/lib/mongodb";

export default async function handler(req, res) {
	await db.connect();

	if (req.method === "DELETE") {
		const { id } = req.query;

		try {
			const product = await Product.findById(id);

			if (!product) {
				return res
					.status(404)
					.json({ success: false, message: "Product not found" });
			}

			// Delete images from Cloudinary using URLs
			await Promise.all(
				product.images.map(async (imageUrl) => {
					// Extract public ID from Cloudinary URL (if needed)
					const publicId = imageUrl.split("/products/")[1].split(".")[0];
					await cloudinary.uploader.destroy(publicId); // Remove this line if you don't want to use publicId
					// Directly destroy by URL
					await cloudinary.uploader.destroy(imageUrl);
				})
			);

			await Product.findByIdAndDelete(id);

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
