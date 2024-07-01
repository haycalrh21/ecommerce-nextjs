import React from "react";

const Card = ({ title, value, icon }) => {
	return (
		<div className='flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md m-2 w-full sm:w-1/2 lg:w-1/5'>
			<div className='text-3xl mb-4'>{icon}</div>
			<h2 className='text-gray-700 text-xl font-semibold mb-2'>{title}</h2>
			<p className='text-gray-800 text-2xl'>{value}</p>
		</div>
	);
};

export default Card;
