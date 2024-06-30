import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		cartItems: [
			{
				id: String,
				imageUrl: String,
				name: String,
				price: Number,
				quantity: Number,
				slug: String,
			},
		],
		status: {
			type: String,
			enum: ["sudah bayar", "belum bayar"],
			default: "belum bayar",
		},
	},
	{ timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
