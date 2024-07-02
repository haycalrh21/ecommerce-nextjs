import { verify } from "jsonwebtoken";

export const authenticateUser = (handler) => async (req, res) => {
	const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "Not authenticated" });
	}

	try {
		const decoded = verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		return handler(req, res);
	} catch (error) {
		return res.status(401).json({ success: false, message: "Invalid token" });
	}
};
