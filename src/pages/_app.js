import Navbar from "@/components/Navbar";

import "@/styles/globals.css";

import { CartProvider } from "@/hooks/cartContext";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

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
				<div className='md:w-3/5 mx-auto py-10 px-6'>
					<Component {...pageProps} />
				</div>
			</CartProvider>
			{/* </UserProvider> */}
		</SessionProvider>
	);
}
