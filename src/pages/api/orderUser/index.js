// /pages/api/orderUser.js

import db from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
	const { method, body } = req;

	await db.connect();

	switch (method) {
		case "POST":
			try {
				const { email } = body; // Ambil email dari body request

				if (!email) {
					throw new Error("Email is required");
				}

				const orders = await Order.find({ email });

				res.status(200).json({ success: true, data: orders });
			} catch (error) {
				console.error("Error fetching orders:", error);
				res.status(400).json({ success: false, error: error.message });
			} finally {
			}
			break;
		default:
			res.setHeader("Allow", ["POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
