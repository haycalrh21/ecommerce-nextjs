import { useEffect, useRef } from "react";
import { useAnimation, motion } from "framer-motion";
import { Inter } from "next/font/google";

import NewProduct from "@/components/NewProduct";
import ShuffleHero from "@/components/HeroBaru";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<ShuffleHero />

			<NewProduct />
		</div>
	);
}
