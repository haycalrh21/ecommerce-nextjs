import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Notfound from "./404";

export const Thanks = () => {
	const { data: session, status } = useSession();

	if (status === "unauthenticated") {
		return <Notfound />;
	}

	return (
		<div className='text-center py-20 px-4'>
			<div className='text-3xl font-bold'>terima kasih sudah berbelanja !</div>
			<div className='text-2xl hover:underline'>
				<Link href={`/dashboard/${session?.user?.email}`}>
					kembali ke halaman dashboard ?
				</Link>
			</div>
			<div className='text-2xl hover:underline'>
				<Link href={"/"}> Halaman utama?</Link>
			</div>
		</div>
	);
};

export default Thanks;
