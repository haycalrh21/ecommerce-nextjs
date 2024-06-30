import { getSession } from "next-auth/react";

export async function checkAdmin(req) {
	try {
		const session = await getSession({ req });

		// Pastikan session ada dan role adalah admin
		if (session && session.user.role === "admin") {
			return true;
		}

		return false;
	} catch (error) {
		console.error("Error checking admin status:", error);
		return false;
	}
}
