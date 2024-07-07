import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import React from "react";

const containerVariants = {
	hidden: { opacity: 0, x: -100 },
	visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

const imageVariants = {
	hidden: { opacity: 0, x: 100 },
	visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

export default function Hero() {
	const controls = useAnimation();
	const containerRef = useRef(null);
	const imageRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						controls.start("visible");
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}
		if (imageRef.current) {
			observer.observe(imageRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
			if (imageRef.current) {
				observer.unobserve(imageRef.current);
			}
		};
	}, [controls]);

	return (
		<section className='mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8'>
			<motion.div
				className='mb-8 flex flex-wrap justify-between md:mb-16'
				initial='hidden'
				animate={controls}
				variants={containerVariants}
				ref={containerRef}
			>
				<motion.div
					className='mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48'
					variants={containerVariants}
				>
					<h1 className='mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl'>
						Top Fashion for a top price!
					</h1>
					<p className='max-w-md leading-relaxed text-gray-500 xl:text-lg'>
						We sell only the most exclusive and high quality products for you.
						We are the best so come and shop with us.
					</p>
				</motion.div>

				<motion.div
					className='mb-12 flex w-full md:mb-16 lg:w-2/3'
					variants={imageVariants}
					ref={imageRef}
				>
					<motion.div
						className='relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0'
						variants={imageVariants}
					>
						<Image
							src='https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							alt='Great Photo'
							className='h-full w-full object-cover object-center'
							priority
							width={500}
							height={500}
						/>
					</motion.div>

					<motion.div
						className='overflow-hidden rounded-lg bg-gray-100 shadow-lg'
						variants={imageVariants}
					>
						<Image
							src='https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							alt='Great Photo'
							className='h-full w-full object-cover object-center'
							width={500}
							height={500}
							priority
						/>
					</motion.div>
				</motion.div>
			</motion.div>
		</section>
	);
}
