import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken"; // Import jwt untuk menghasilkan token

export default NextAuth({
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user?._id) token._id = user._id;
			if (user?.role) token.role = user.role;
			return token;
		},

		async session({ session, token }) {
			if (token?._id) session.user._id = token._id;
			if (token?.role) session.user.role = token.role;

			const accessToken = jwt.sign({}, process.env.NEXTAUTH_SECRET, {
				algorithm: "HS256",
			});

			session.accessToken = accessToken;
			return session;
		},
	},
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				await db.connect();

				const user = await User.findOne({ email: credentials.email });

				if (
					user &&
					(await bcrypt.compare(credentials.password, user.password))
				) {
					const token = {}; // Atur token sesuai kebutuhan aplikasi Anda
					return {
						_id: user._id,
						name: user.name,
						email: user.email,
						role: user.role,
						token, // Mengembalikan token sebagai bagian dari objek yang dikembalikan
					};
				}

				throw new Error("Invalid email or password");
			},
		}),
	],
	pages: {
		signIn: "/login", // Halaman untuk sign in
	},
});
