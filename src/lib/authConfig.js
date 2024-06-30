import { NextResponse } from "next/server";

export const authConfig = {
	pages: {
		signIn: "/login",
	},
	providers: [],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.isAdmin = user.isAdmin;
				token.accessToken = user.accessToken; // Menyimpan accessToken di dalam token JWT
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.isAdmin = token.isAdmin;
				session.accessToken = token.accessToken; // Menyimpan accessToken di dalam session
			}
			return session;
		},
		authorized({ auth, request }) {
			const user = auth?.user;
			const nextUrl = request?.nextUrl;
			const isOnAdminPanel = nextUrl?.pathname.startsWith("/admin");

			// Hanya admin yang bisa mengakses halaman /admin/**
			if (isOnAdminPanel && !user?.isAdmin) {
				return NextResponse.redirect(new URL("/", nextUrl)); // Redirect jika bukan admin
			}

			// Hanya pengguna yang terautentikasi yang bisa mengakses halaman /blog
			if (nextUrl?.pathname.startsWith("/blog") && !user) {
				return false; // Tidak izinkan akses jika tidak terautentikasi
			}

			// Hanya pengguna yang belum terautentikasi yang bisa mengakses halaman /login
			if (nextUrl?.pathname.startsWith("/login") && user) {
				return NextResponse.redirect(new URL("/", nextUrl)); // Redirect jika sudah terautentikasi
			}

			return true; // Izinkan akses jika tidak ada aturan yang bertentangan
		},
	},
};
