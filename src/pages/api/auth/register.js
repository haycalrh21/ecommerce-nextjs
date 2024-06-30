import db from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { name, email, password } = req.body;

		try {
			await db.connect();

			const userCount = await User.countDocuments();

			let role = "user";
			if (userCount < 1) {
				role = "admin";
			}

			const user = new User({
				name,
				email,
				password,
				role,
			});

			await user.save();

			res.status(201).json({ message: "User created successfully" });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error", error });
		} finally {
			null;
		}
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}
