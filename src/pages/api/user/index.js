import db from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
	try {
		await db.connect();

		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({
				statusCode: 401,
				status: false,
				message: "Unauthorized: No token provided",
			});
		}

		const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET || "");

		if (!decodedToken || decodedToken.role !== "admin") {
			return res.status(403).json({
				statusCode: 403,
				status: false,
				message: "Unauthorized: Not an admin",
			});
		}

		const users = await User.find({});
		res.status(200).json(users);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Server error" });
	} finally {
		// Pastikan untuk memanggil disconnect di sini jika diperlukan
		// db.disconnect();
	}
}
