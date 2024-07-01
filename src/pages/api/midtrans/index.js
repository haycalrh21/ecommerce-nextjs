import db from "@/lib/mongodb";
import midtransClient from "midtrans-client";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		await db.connect();
		const { orderId, customerDetails, item_details } = req.body;

		// Hitung gross_amount dari item_details
		const grossAmount = item_details.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);

		let snap = new midtransClient.Snap({
			isProduction: false,
			serverKey: process.env.MIDTRANS_SERVER_KEY,
			clientKey: process.env.MIDTRANS_CLIENT_KEY,
		});

		let parameter = {
			transaction_details: {
				order_id: orderId,
				gross_amount: grossAmount,
			},
			enabled_payments: ["gopay", "other_va", "bri_va", "echannel", "bca_va"],
			item_details: item_details,
			customer_details: customerDetails,
			// finish_redirect_url: "/thanks",
		};

		const transaction = await snap.createTransaction(parameter);
		const token = transaction.token;

		res.status(200).json({
			token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
}
