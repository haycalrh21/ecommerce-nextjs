import React, { useState } from "react";

const Layout = ({ children }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	return (
		<div className='flex flex-col md:flex-row min-h-screen'>
			<aside className='bg-gray-900 text-white p-4 w-full md:w-64 h-64 md:h-auto overflow-y-auto'>
				<div className='md:hidden'>
					<button
						className='bg-gray-800 text-white p-2 rounded'
						onClick={toggleDropdown}
					>
						Menu
					</button>
					{isDropdownOpen && (
						<ul className='mt-2'>
							<li className='py-2'>Getting Started</li>
							<li className='py-2'>Building Your Application</li>
							<li className='py-2'>API Reference</li>
							{/* Add more items as needed */}
						</ul>
					)}
				</div>
				<div className='hidden md:block'>
					<ul>
						<li className='py-2'>Getting Started</li>
						<li className='py-2'>Building Your Application</li>
						<li className='py-2'>API Reference</li>
						{/* Add more items as needed */}
					</ul>
				</div>
			</aside>
			<main className='flex-grow p-4'>
				{/* Main Content */}
				{children}
			</main>
			<aside className='bg-gray-900 text-white p-4 w-full md:w-64 h-64 md:h-auto overflow-y-auto'>
				{/* Right Aside Content */}
				<ul>
					<li className='py-2'>On this page</li>
					<li className='py-2'>Accessibility</li>
					<li className='py-2'>Join our Community</li>
					{/* Add more items as needed */}
				</ul>
			</aside>
		</div>
	);
};

export default Layout;
