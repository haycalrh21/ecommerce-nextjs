// pages/api/wishlist.js
import db from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

export default async function handler(req, res) {
	await db.connect();
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const { userId } = req.query;
				const wishlistItems = await Wishlist.find({ userId }).populate(
					"productId"
				);
				res.status(200).json({ success: true, data: wishlistItems });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		case "POST":
			try {
				const { userId, productId } = req.body;

				// Check if productId already exists for userId
				const existingItem = await Wishlist.findOne({ userId, productId });
				if (existingItem) {
					return res
						.status(400)
						.json({
							success: false,
							error: "Product already exists in wishlist",
						});
				}

				const wishlistItem = await Wishlist.create({ userId, productId });
				res.status(201).json({ success: true, data: wishlistItem });
			} catch (error) {
				res.status(400).json({ success: false });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
