import { useEffect, useRef } from "react";
import { useAnimation, motion } from "framer-motion";
import { Inter } from "next/font/google";

import Hero from "@/components/Hero";
import NewProduct from "@/components/NewProduct";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const controlsHero = useAnimation();
	const controlsNewProduct = useAnimation();
	const heroRef = useRef(null);
	const newProductRef = useRef(null);

	useEffect(() => {
		const observerHero = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						controlsHero.start("visible");
					}
				});
			},
			{ threshold: 0.1 }
		);

		const observerNewProduct = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						controlsNewProduct.start("visible");
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (heroRef.current) {
			observerHero.observe(heroRef.current);
		}
		if (newProductRef.current) {
			observerNewProduct.observe(newProductRef.current);
		}

		return () => {
			if (heroRef.current) {
				observerHero.unobserve(heroRef.current);
			}
			if (newProductRef.current) {
				observerNewProduct.unobserve(newProductRef.current);
			}
		};
	}, [controlsHero, controlsNewProduct]);

	const variants = {
		hidden: { opacity: 0, y: -100 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<motion.div
				ref={heroRef}
				initial='hidden'
				animate={controlsHero}
				variants={variants}
				transition={{ duration: 0.5 }}
			>
				<Hero />
			</motion.div>
			<div></div>
			<motion.div
				ref={newProductRef}
				initial='hidden'
				animate={controlsNewProduct}
				variants={variants}
				transition={{ duration: 0.5 }}
			>
				<NewProduct />
			</motion.div>
		</div>
	);
}
