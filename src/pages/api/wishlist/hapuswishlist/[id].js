import db from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

export default async function handler(req, res) {
	console.log("Handler invoked");
	await db.connect();

	if (req.method === "DELETE") {
		const { id } = req.query;
		try {
			console.log(`Attempting to delete wishlist item with id: ${id}`);
			const wishlist = await Wishlist.findById(id);
			if (!wishlist) {
				console.log(`Wishlist item with id ${id} not found`);
				return res
					.status(404)
					.json({ success: false, error: "Wishlist not found" });
			}
			await Wishlist.findByIdAndDelete(id);
			console.log(`Wishlist item with id ${id} deleted successfully`);
			res.status(200).json({ success: true, data: wishlist });
		} catch (error) {
			console.error(`Error deleting wishlist item with id ${id}:`, error);
			res.status(400).json({ success: false, error: error.message });
		}
	} else {
		console.log(`Method ${req.method} not allowed`);
		res.setHeader("Allow", ["DELETE"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
