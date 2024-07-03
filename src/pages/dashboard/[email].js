import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardUser from "@/components/page/dashboardUser/dashboarUser";

const Dashboard = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [orders, setOrders] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);

	const fetchOrders = async () => {
		try {
			const email = session?.user?.email;
			if (!email) {
				throw new Error("User email not found");
			}

			const res = await fetch("/api/orderUser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (!res.ok) {
				throw new Error("Failed to fetch orders");
			}

			const data = await res.json();
			if (data.success) {
				return data.data;
			} else {
				throw new Error(data.error || "Failed to fetch orders");
			}
		} catch (error) {
			console.error("Error fetching orders:", error);
			return [];
		}
	};

	const fetchWishlist = async () => {
		try {
			const email = session?.user?.email;
			if (!email) {
				throw new Error("User email not found");
			}
			const res = await fetch("/api/wishlist/wishlistuser", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			if (!res.ok) {
				throw new Error("Failed to fetch wishlist");
			}
			const data = await res.json();
			if (data.success) {
				return data.data;
			} else {
				throw new Error(data.error || "Failed to fetch wishlist");
			}
		} catch (error) {
			console.error("Error fetching wishlist:", error);
			return [];
		}
	};

	useEffect(() => {
		if (status === "authenticated") {
			fetchOrders().then((filteredOrders) => {
				// Filter orders based on session email
				const filtered = filteredOrders.filter(
					(order) => order.email === session.user.email
				);
				setOrders(filtered);
			});

			fetchWishlist().then((wishlistItems) => {
				// Set wishlist items state
				setWishlist(wishlistItems);
			});
		}
	}, [session, status]);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status]);

	const showNota = (order) => {
		setSelectedOrder(order);
	};

	const closeNota = () => {
		setSelectedOrder(null);
	};

	return (
		<DashboardUser
			orders={orders}
			wishlist={wishlist}
			showNota={showNota}
			closeNota={closeNota}
		/>
	);
};

export default Dashboard;
