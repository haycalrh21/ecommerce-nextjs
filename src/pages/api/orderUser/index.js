// pages/api/orders.js

import { getSession } from "next-auth/react";
import db from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
	const { method } = req;

	// Connect to database
	await db.connect();

	// Get the session
	const session = await getSession({ req });

	if (!session) {
		return res
			.status(401)
			.json({ success: false, message: "Not authenticated" });
	}

	switch (method) {
		case "GET":
			try {
				// Find orders based on the logged-in user's email
				const orders = await Order.find({ email: session.user.email });

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
