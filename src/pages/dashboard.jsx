import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import DashboardUser from "@/components/page/dashboardUser/dashboarUser";

const Dashboard = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);

	const fetchOrders = async (session) => {
		try {
			const res = await fetch("/api/orderUser", {
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
				},
			});
			const data = await res.json();
			return data.data; // Mengembalikan semua data pesanan dari API
		} catch (error) {
			console.error("Error fetching orders:", error);
			return [];
		}
	};
	useEffect(() => {
		if (status === "authenticated") {
			fetchOrders(session).then((filteredOrders) => {
				setOrders(filteredOrders);
			});
		}
	}, [status]);

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
		<DashboardUser orders={orders} showNota={showNota} closeNota={closeNota} />
	);
};

export default Dashboard;
