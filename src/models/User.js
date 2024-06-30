import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Import bcryptjs

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},

	password: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

// Middleware untuk hashing password sebelum disimpan
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
