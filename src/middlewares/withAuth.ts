import { getToken } from "next-auth/jwt";
import {
	NextFetchEvent,
	NextMiddleware,
	NextRequest,
	NextResponse,
} from "next/server";

const onlyAdmin = ["admin"];
const authPage = ["auth"];

export default function withAuth(
	middleware: NextMiddleware,
	requireAuth: string[] = []
) {
	return async (req: NextRequest, next: NextFetchEvent) => {
		const pathname = req.nextUrl.pathname.split("/")[1];

		if (requireAuth.includes(pathname)) {
			const token = await getToken({
				req,
				secret: process.env.NEXTAUTH_SECRET,
			});

			// Jika tidak ada token, arahkan pengguna ke halaman login
			if (!token && !authPage.includes(pathname)) {
				const url = new URL("/auth/login", req.url);
				url.searchParams.set("callbackUrl", encodeURI(req.url));
				return NextResponse.redirect(url);
			}

			// Jika ada token, lakukan pengecekan sesuai dengan peraturan Anda
			if (token) {
				// Jika pengguna mencoba mengakses halaman autentikasi, arahkan mereka kembali ke halaman utama
				if (authPage.includes(pathname)) {
					return NextResponse.redirect(new URL("/", req.url));
				}

				// Jika pengguna tidak memiliki peran admin dan mencoba mengakses halaman yang hanya untuk admin, arahkan mereka kembali ke halaman utama
				if (token.role !== "admin" && onlyAdmin.includes(pathname)) {
					return NextResponse.redirect(new URL("/", req.url));
				}
			}
		}

		// Jika tidak ada masalah, lanjutkan dengan middleware yang diberikan
		return middleware(req, next);
	};
}
