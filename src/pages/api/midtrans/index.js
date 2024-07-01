import midtransClient from "midtrans-client";
import db from "@/lib/mongodb";
import Order from "@/models/Order";

const midtrans = new midtransClient.Snap({
	isProduction: false,
	serverKey: process.env.MIDTRANS_SERVER_KEY,
	clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { name, email, address, phone, jumlahBayar, cartItems } = req.body;

		const parameter = {
			transaction_details: {
				order_id: `order-${Math.floor(Math.random() * 1e9)}`,
				gross_amount: jumlahBayar,
			},
			credit_card: {
				secure: true,
			},
			customer_details: {
				first_name: name,
				email: email,
				phone: phone,
				address: address,
			},
			item_details: cartItems.map((item) => ({
				id: item.id,
				price: item.price,
				quantity: item.quantity,
				name: item.name,
			})),
		};

		try {
			// Connect to the database
			await db.connect();

			// Create a transaction with Midtrans
			const transaction = await midtrans.createTransaction(parameter);

			// Save the order to the database
			const newOrder = new Order({
				name,
				email,
				phone,
				address,
				cartItems,
				jumlahBayar,
				token: transaction.token,
				status: "belum bayar", // Default status
			});

			await newOrder.save();

			// Send response with transaction token and order ID
			res.status(200).json({ token: transaction.token, orderId: newOrder._id });
		} catch (error) {
			console.error("Error creating transaction or saving order:", error);
			res
				.status(500)
				.json({ message: "Error creating transaction or saving order", error });
		} finally {
		}
	} else if (req.method === "PUT") {
		const { orderId, status } = req.body;

		try {
			// Update order status in the database
			await db.connect();
			const updatedOrder = await Order.findOneAndUpdate(
				{ _id: orderId },
				{ status: status },
				{ new: true }
			);

			if (!updatedOrder) {
				return res.status(404).json({ message: "Order not found" });
			}

			res.status(200).json({ message: "Order status updated successfully" });
		} catch (error) {
			console.error("Error updating order status:", error);
			res.status(500).json({ message: "Error updating order status", error });
		} finally {
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
