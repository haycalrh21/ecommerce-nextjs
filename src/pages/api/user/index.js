// pages/api/users.js

import db from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "next-auth/react"; // Import getSession dari NextAuth.js

export default async function handler(req, res) {
	await db.connect();

	try {
		const session = await getSession({ req });

		if (session) {
			// Cek jika pengguna memiliki role admin (contoh: menggunakan role)
			if (session.user.role === "admin") {
				const users = await User.find({});
				res.status(200).json(users);
			} else {
				res.status(403).json({ message: "Unauthorized" });
			}
		} else {
			res.status(401).json({ message: "Not authenticated" });
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ message: "Server error" });
	}
}
