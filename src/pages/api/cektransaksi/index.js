import db from "@/lib/mongodb";
import Transaction from "@/models/transaction";

export default async function handler(req, res) {
	try {
		await db.connect();

		const transactions = await Transaction.find({});

		// Mengambil hanya properti orderId, userId, dan status dari setiap transaksi
		const formattedTransactions = transactions.map((transaction) => ({
			orderId: transaction.orderId,
			userId: transaction.userId,
			status: transaction.status,
		}));

		res.status(200).json({ data: formattedTransactions });
	} catch (error) {
		console.error("Error fetching transactions:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
}
