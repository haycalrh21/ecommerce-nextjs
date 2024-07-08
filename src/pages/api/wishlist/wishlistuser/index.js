// pages/api/wishlist/wishlistuser.js

import db from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product"; // Pastikan model Product sudah diimpor dengan benar
import User from "@/models/User";

export default async function handler(req, res) {
	const { body } = req; // Ambil body request
	await db.connect();

	if (req.method === "POST") {
		try {
			const { email } = body; // Ambil email dari body request
			if (!email) {
				return res
					.status(400)
					.json({ success: false, error: "Missing email parameter" });
			}

			// Dapatkan userId berdasarkan email
			const user = await User.findOne({ email });

			if (!user) {
				return res
					.status(404)
					.json({ success: false, error: "User not found" });
			}

			// Dapatkan wishlistItems berdasarkan userId
			const wishlistItems = await Wishlist.find({
				userId: user._id,
			});

			if (!wishlistItems || wishlistItems.length === 0) {
				return null;
			}

			// Array untuk menyimpan detail produk dari wishlist
			const wishlistWithProductDetails = [];

			// Loop melalui setiap item di wishlistItems
			for (let i = 0; i < wishlistItems.length; i++) {
				const { productId } = wishlistItems[i];

				// Temukan produk berdasarkan productId
				const product = await Product.findById(productId);

				if (product) {
					// Ambil informasi yang dibutuhkan dari produk
					const { name, price, images } = product;

					// Tambahkan detail produk ke dalam array response
					wishlistWithProductDetails.push({
						_id: wishlistItems[i]._id,
						productId,
						name,
						price,
						images,
					});
				}
			}

			// Kirim respons dengan data wishlist yang sudah termasuk detail produk
			res.status(200).json({ success: true, data: wishlistWithProductDetails });
		} catch (error) {
			console.error("Error fetching wishlist items:", error);
			res
				.status(500)
				.json({ success: false, error: "Failed to fetch wishlist" });
		} finally {
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res
			.status(405)
			.json({ success: false, error: `Method ${req.method} not allowed` });
	}
}
