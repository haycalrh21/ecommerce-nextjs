import Link from "next/link";
import React from "react";

export default function Notfound() {
	return (
		<div className='text-3xl text-center font-bold py-20'>
			apa sih yang lu cari
			<div>
				<Link href='/' className='text-2xl hover:underline'>
					Mending balik lagi kehalaman yuk?
				</Link>
			</div>
		</div>
	);
}
