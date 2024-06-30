// middleware/uploadMiddleware.js
import nextConnect from "next-connect";
import multer from "multer";
import cloudinary from "@/lib/cloudinary";

const upload = multer({ storage: multer.memoryStorage() });

const uploadMiddleware = nextConnect();

uploadMiddleware.use(upload.array("images"));

uploadMiddleware.use(async (req, res, next) => {
	if (!req.files) return next();

	const uploads = req.files.map((file) => {
		return new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({ folder: "products" }, (error, result) => {
					if (error) reject(error);
					else resolve(result.secure_url);
				})
				.end(file.buffer);
		});
	});

	req.body.images = await Promise.all(uploads);
	next();
});

export default uploadMiddleware;
