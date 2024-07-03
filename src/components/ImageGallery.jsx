import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ImageGallery({ images }) {
	const [bigImage, setBigImage] = useState(images[0]);

	const handleSmallImageClick = (image) => {
		setBigImage(image);
	};

	return (
		<div className='grid gap-4 lg:grid-cols-5 mt-20'>
			<div className='order-last flex gap-4 lg:order-none lg:flex-col'>
				{images.map((image, idx) => (
					<div
						key={idx}
						className='overflow-hidden rounded-lg border-4 border-black'
						onClick={() => handleSmallImageClick(image)}
					>
						<Image
							src={image}
							width={100}
							height={100}
							alt='photo'
							className='h-full w-full cursor-pointer object-cover object-center'
						/>
					</div>
				))}
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				className='relative overflow-hidden rounded-lg border-4 border-black lg:col-span-4'
			>
				<Image
					src={bigImage}
					alt='Photo'
					width={500}
					height={500}
					className='h-full w-full object-cover object-center'
				/>
			</motion.div>
		</div>
	);
}
