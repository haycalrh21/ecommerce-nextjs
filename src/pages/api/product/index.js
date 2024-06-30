// pages/api/products/index.js

import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import db from "@/lib/mongodb";

export default async function handler(req, res) {
	await db.connect();

	if (req.method === "POST") {
		const { name, category, slug, price, stock, images } = req.body;

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
				images: imageUrls,
			});
			await product.save();
			res.status(201).json({ success: true, data: product });
		} catch (error) {
			res.status(400).json({ success: false, error: error.message });
		}
	} else {
		res.status(405).json({ success: false, message: "Method not allowed" });
	}
}
