// pages/api/products/index.js
import db from "@/lib/mongodb";
import Product from "@/models/Product";
export default async function handler(req, res) {
	await db.connect();

	try {
		switch (req.method) {
			case "GET":
				const products = await Product.find({});
				const convertedProducts = products.map(db.convertToObj);
				res.status(200).json(convertedProducts);
				break;
			// Tambahkan metode lain (POST, PUT, DELETE) jika diperlukan
			default:
				res.setHeader("Allow", ["GET"]);
				res.status(405).end(`Method ${req.method} Not Allowed`);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		// Jangan tutup koneksi karena mongoose menggunakan cache
	}
}
