import { NextRequest, NextResponse } from "next/server";
import withAuth from "./middlewares/withAuth";

export function mainMiddleware() {
	const res = NextResponse.next();
	return res;
}

export default withAuth(mainMiddleware, [
	//pengecekan bila ada role admin dan sudah login
	"admin",
	// "login",
	// "register",
]);
