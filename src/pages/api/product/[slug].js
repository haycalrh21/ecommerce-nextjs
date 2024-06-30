// pages/api/product/[slug].js
import db from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req, res) {
	const { slug } = req.query;

	await db.connect();

	try {
		const product = await Product.findOne({ slug });
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	} finally {
		return null;
	}
}
