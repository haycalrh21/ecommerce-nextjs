import Navbar from "@/components/Navbar";

import "@/styles/globals.css";

import { CartProvider } from "@/hooks/cartContext";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const disableNavbar = ["admin", "login", "register"];

export default function App({ Component, pageProps, session }) {
	const { pathname } = useRouter();
	const shouldDisableNavbar = disableNavbar.some((path) =>
		pathname.startsWith(`/${path}`)
	);

	return (
		<SessionProvider session={session}>
			{/* <UserProvider> */}
			<CartProvider>
				{!shouldDisableNavbar && <Navbar />}
				<div className='min-h-screen bg-[#EEEDEB]'>
					<Component {...pageProps} />
					<Toaster />
				</div>
				{!shouldDisableNavbar && <Footer />}
			</CartProvider>
			{/* </UserProvider> */}
		</SessionProvider>
	);
}
