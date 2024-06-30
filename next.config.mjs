/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// async rewrites() {
	// 	return [
	// 		{
	// 			source: "/api/:path*",
	// 			destination: "http://localhost:4000/api/:path*",
	// 		},
	// 	];
	// },
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
			},
			{ protocol: "https", hostname: "res.cloudinary.com" },
		],
	},
};

export default nextConfig;
