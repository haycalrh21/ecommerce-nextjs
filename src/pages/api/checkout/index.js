import db from "@/lib/mongodb";
import Order from "@/models/Order";

export default async function handler(req, res) {
	const { method } = req;

	await db.connect();

	switch (method) {
		case "POST":
			try {
				const { name, email, phone, address, cartItems, jumlahBayar } =
					req.body;

				if (
					!name ||
					!email ||
					!phone ||
					!address ||
					!cartItems ||
					!jumlahBayar
				) {
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
					jumlahBayar,
				});

				const savedOrder = await order.save();

				res.status(201).json({ success: true, data: savedOrder });
			} catch (error) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		case "PUT":
			try {
				const { orderId, status, token } = req.body;

				if (!orderId || !status || typeof token === "undefined") {
					return res
						.status(400)
						.json({ success: false, error: "Data tidak lengkap" });
				}

				const updatedOrder = await Order.findOneAndUpdate(
					{ _id: orderId },
					{ $set: { status, token } },
					{ new: true }
				);

				if (!updatedOrder) {
					return res
						.status(404)
						.json({ success: false, error: "Order tidak ditemukan" });
				}

				res.status(200).json({ success: true, data: updatedOrder });
			} catch (error) {
				res.status(400).json({ success: false, error: error.message });
			}
			break;
		default:
			res.setHeader("Allow", ["POST", "PUT"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
