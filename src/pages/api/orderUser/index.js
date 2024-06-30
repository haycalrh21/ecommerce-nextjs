// pages/api/orders.js

import db from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
	const { method, query } = req;

	await db.connect();

	switch (method) {
		case "GET":
			try {
				let orders;
				if (query.name) {
					orders = await Order.find({ name: query.name });
				} else {
					orders = await Order.find();
				}
				res.status(200).json({ success: true, data: orders });
			} catch (error) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
