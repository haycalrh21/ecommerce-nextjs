import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewProduct from "@/components/NewProduct";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<div>
				<Hero />
				<NewProduct />
			</div>
		</div>
	);
}
