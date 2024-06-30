import mongoose from "mongoose";

async function connect() {
	const MONGODB_URI = process.env.MONGODB_URI; // Mengambil URL MongoDB dari variabel lingkungan

	await mongoose.connect(MONGODB_URI);

	console.log("Connected.");
}

function convertToObj(doc) {
	doc._id = doc._id.toString();
	return doc;
}

const db = { connect, convertToObj };
export default db;
