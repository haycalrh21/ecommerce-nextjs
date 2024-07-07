import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const ShuffleHero = () => {
	const [images, setImages] = useState([]);
	const router = useRouter();

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch("/api/product/getproduct");
				const data = await response.json();
				const imageUrls = data.map((product) => ({
					id: product._id,
					src: product.images[0],
				}));
				setImages(imageUrls);
			} catch (error) {
				console.error("Error fetching images:", error);
			}
		};

		fetchImages();
	}, []);

	return (
		<section className='w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto'>
			<div>
				<span className='block mb-4 text-xs md:text-sm text-gray-500 font-medium'>
					Better every day
				</span>
				<h3 className='text-4xl md:text-6xl font-semibold'>
					Top Fashion for a top price!
				</h3>
				<p className='text-base md:text-lg text-slate-700 my-4 md:my-6'>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam nobis in
					error repellat voluptatibus ad.
				</p>
				<button
					className='bg-gray-500 text-white font-medium py-2 px-4 rounded transition-all hover:bg-indigo-600 active:scale-95'
					onClick={() => router.push("/products")}
				>
					Find a Product
				</button>
			</div>
			<ShuffleGrid images={images} />
		</section>
	);
};

const shuffle = (array) => {
	let currentIndex = array.length,
		randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
};

const generateSquares = (images) => {
	const squareData = images.map((image) => ({
		id: image.id,
		src: image.src,
	}));

	return shuffle(squareData).map((sq) => (
		<motion.div
			key={sq.id}
			layout
			transition={{ duration: 1.5, type: "spring" }}
			className='w-full h-full border-2 border-black'
			style={{
				backgroundImage: `url(${sq.src})`,
				backgroundSize: "cover",
			}}
		></motion.div>
	));
};

const ShuffleGrid = ({ images }) => {
	const timeoutRef = useRef(null);
	const [squares, setSquares] = useState([]);

	useEffect(() => {
		if (images.length > 0) {
			setSquares(generateSquares(images));
		}
	}, [images]);

	useEffect(() => {
		const shuffleSquares = () => {
			setSquares(generateSquares(images));
			timeoutRef.current = setTimeout(shuffleSquares, 3000);
		};

		if (images.length > 0) {
			shuffleSquares();
		}

		return () => clearTimeout(timeoutRef.current);
	}, [images]);

	return (
		<div className='grid grid-cols-4 grid-rows-4 h-[450px] gap-1 '>
			{squares}
		</div>
	);
};

export default ShuffleHero;
