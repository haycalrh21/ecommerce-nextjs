import db from "@/lib/mongodb";
import Order from "@/models/Order";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
	const { method } = req;

	await db.connect();
	const session = await getSession({ req });

	switch (method) {
		case "GET":
			try {
				if (!session) {
					throw new Error("User not authenticated");
				}

				const orders = await Order.find({ email: session.user.email });

				res.status(200).json({ success: true, data: orders });
			} catch (error) {
				console.error("Error fetching orders:", error);
				res.status(400).json({ success: false, error: error.message });
			} finally {
			}
			break;
		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
