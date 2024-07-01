// pages/api/transaction.js

import db from "@/lib/mongodb";
import Transaction from "@/models/transaction";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	try {
		await db.connect();

		const { orderId, userId, paymentMethod, grossAmount } = req.body;

		// Simpan data transaksi ke MongoDB
		const transaction = new Transaction({
			orderId,
			userId,
			paymentMethod,
			grossAmount,
		});

		await transaction.save();

		res.status(201).json({ message: "Transaction saved successfully" });
	} catch (error) {
		console.error("Error saving transaction:", error);
		res.status(500).json({ message: "Internal Server Error" });
	} finally {
	}
}
