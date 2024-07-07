import { useEffect, useRef } from "react";
import { useAnimation, motion } from "framer-motion";
import { Inter } from "next/font/google";

import NewProduct from "@/components/NewProduct";
import ShuffleHero from "@/components/HeroBaru";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const controlsHero = useAnimation();
	const controlsNewProduct = useAnimation();
	const controlsSection3 = useAnimation(); // Tambahkan kontrol animasi untuk section tambahan

	const heroRef = useRef(null);
	const newProductRef = useRef(null);
	const section3Ref = useRef(null); // Tambahkan ref untuk section tambahan

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

		const observerSection3 = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						controlsSection3.start("visible");
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
		if (section3Ref.current) {
			observerSection3.observe(section3Ref.current);
		}

		return () => {
			if (heroRef.current) {
				observerHero.unobserve(heroRef.current);
			}
			if (newProductRef.current) {
				observerNewProduct.unobserve(newProductRef.current);
			}
			if (section3Ref.current) {
				observerSection3.unobserve(section3Ref.current);
			}
		};
	}, [controlsHero, controlsNewProduct, controlsSection3]);

	const heroVariants = {
		hidden: { opacity: 0, x: -50 },
		visible: { opacity: 1, x: 0 },
	};

	const newProductVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 },
	};

	const section3Variants = {
		hidden: { opacity: 0, x: 50 },
		visible: { opacity: 1, x: 0 },
	};

	return (
		<div className='md:w-4/5 mx-auto py-10 px-6'>
			<motion.div
				ref={heroRef}
				initial='hidden'
				animate={controlsHero}
				variants={heroVariants}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<ShuffleHero />
				{/* <Hero /> */}
			</motion.div>

			<motion.div
				ref={newProductRef}
				initial='hidden'
				animate={controlsNewProduct}
				variants={newProductVariants}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<NewProduct />
			</motion.div>

			{/* <motion.div
				ref={section3Ref}
				initial='hidden'
				animate={controlsSection3}
				variants={section3Variants}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className='my-16'
			>
				<h2 className='text-2xl font-bold mb-4'>Section 3</h2>
			</motion.div> */}
		</div>
	);
}
