import mongoose from "mongoose";

const { Schema } = mongoose;

const wishlistSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	productId: { type: Schema.Types.ObjectId, required: true, unique: true },
});

const Wishlist =
	mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
