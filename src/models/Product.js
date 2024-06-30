// models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	slug: { type: String, required: true, unique: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true },
	images: [{ type: String, required: true }],
});

const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
