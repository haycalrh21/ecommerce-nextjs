// pages/api/cloudinary.js

import cloudinary from "cloudinary";

// Inisialisasi Cloudinary
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			// Example: Fetch images from Cloudinary
			const { resources } = await cloudinary.v2.api.resources({
				type: "upload",
				prefix: process.env.CLOUDINARY_FOLDER,
				max_results: 20, // Jumlah maksimal gambar yang ingin diambil
			});

			// Ambil URL dari setiap gambar
			const imageUrls = resources.map((resource) => resource.secure_url);

			res.status(200).json({ images: imageUrls });
		} catch (error) {
			console.error("Error fetching images from Cloudinary:", error);
			res.status(500).json({ error: "Failed to fetch images from Cloudinary" });
		}
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).json({ message: `Method ${req.method} Not Allowed` });
	}
}
