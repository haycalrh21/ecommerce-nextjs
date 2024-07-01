// pages/api/products/index.js
import db from "@/lib/mongodb";
import Product from "@/models/Product";
export default async function handler(req, res) {
	await db.connect();

	try {
		const users = await Product.find({});
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		// Jangan tutup koneksi karena mongoose menggunakan cache
	}
}
