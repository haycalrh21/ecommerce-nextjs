import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
	orderId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	paymentMethod: {
		type: String,
		required: true,
	},
	grossAmount: {
		type: Number,
		required: true,
	},
	status: {
		type: String,

		required: true,
		default: "sudah bayar", // Atau sesuaikan nilai default sesuai kebutuhan aplikasi Anda
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Transaction =
	mongoose.models.Transaction ||
	mongoose.model("Transaction", transactionSchema);

export default Transaction;
