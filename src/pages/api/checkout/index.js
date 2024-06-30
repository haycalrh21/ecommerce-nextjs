// pages/api/order.js

import db from "@/lib/mongodb";

import Order from "@/models/Order";

export default async function handler(req, res) {
	const { method } = req;

	await db.connect();

	switch (method) {
		case "POST":
			try {
				const { name, email, phone, address, cartItems } = req.body;

				if (!name || !email || !phone || !address || !cartItems) {
					return res
						.status(400)
						.json({ success: false, error: "Data order tidak lengkap" });
				}

				const order = new Order({
					name,
					email,
					phone,
					address,
					cartItems,
				});

				const savedOrder = await order.save();

				res.status(201).json({ success: true, data: savedOrder });
			} catch (error) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["POST"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
