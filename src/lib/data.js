// data.js

const createSlug = (name) => {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
};

export const products = [
	{
		_id: "1437824",
		name: "Sepatu Olahraga Terbaru",
		slug: "sepatu-olahraga-terbaru",
		categoryName: "Sepatu Olahraga",
		price: 1500000,
		imageUrl: "https://via.placeholder.com/300",
		imageUrl1: "https://via.placeholder.com/400",
		imageUrl2: "https://via.placeholder.com/500",
		description:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
	},
	{
		_id: "2423742376",
		name: "Tas Ransel Stylish",
		slug: "tas-ransel-stylish",
		categoryName: "Aksesoris",
		price: 500000,
		imageUrl: "https://via.placeholder.com/300",
		imageUrl1: "https://via.placeholder.com/400",
		imageUrl2: "https://via.placeholder.com/500",
	},
	{
		_id: "3423489237",
		name: "Jam Tangan Elegan",
		slug: "jam-tangan-elegan",
		categoryName: "Jam Tangan",
		price: 1200000,
		imageUrl: "https://via.placeholder.com/300",
		imageUrl1: "https://via.placeholder.com/400",
		imageUrl2: "https://via.placeholder.com/500",
	},
	{
		_id: "442376423767823",
		name: "Kemeja Kasual",
		slug: "kemeja-kasual",
		categoryName: "Pakaian",
		price: 250000,
		imageUrl: "https://via.placeholder.com/300",
		imageUrl1: "https://via.placeholder.com/400",
		imageUrl2: "https://via.placeholder.com/500",
	},
];

products.forEach((product) => {
	product.slug = createSlug(product.name);
});
