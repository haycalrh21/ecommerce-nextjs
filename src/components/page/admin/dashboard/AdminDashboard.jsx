import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import LineChart from "../components/LineChart";
import { AdminLayout } from "../AdminLayout";
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

export default function AdminDashboard() {
	const { data: session } = useSession();
	const [orders, setOrders] = useState([]);
	const [users, setUsers] = useState([]);
	const [products, setProducts] = useState([]);
	const [revenue, setRevenue] = useState(0);
	const [monthlyRevenue, setMonthlyRevenue] = useState([]);

	const fetchOrders = async () => {
		try {
			const res = await fetch("/api/order");
			const data = await res.json();
			setOrders(data.data);
			calculateRevenue(data.data);
			calculateMonthlyRevenue(data.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	const fetchUsers = async () => {
		try {
			if (session) {
				const res = await fetch("/api/user", {
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
					},
				});
				const data = await res.json();
				setUsers(data);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const fetchProducts = async () => {
		try {
			const res = await fetch("/api/product/getproduct");
			const data = await res.json();
			setProducts(data);
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};

	const calculateRevenue = (orders) => {
		const totalRevenue = orders.reduce((acc, order) => {
			const orderTotal = order.cartItems.reduce((orderAcc, item) => {
				return orderAcc + item.price * item.quantity;
			}, 0);
			return acc + orderTotal;
		}, 0);
		setRevenue(totalRevenue);
	};

	const calculateMonthlyRevenue = (orders) => {
		const monthlyRevenue = {};

		orders.forEach((order) => {
			const month = dayjs(order.createdAt).format("YYYY-MM");
			const orderTotal = order.cartItems.reduce((orderAcc, item) => {
				return orderAcc + item.price * item.quantity;
			}, 0);

			if (monthlyRevenue[month]) {
				monthlyRevenue[month] += orderTotal;
			} else {
				monthlyRevenue[month] = orderTotal;
			}
		});

		const monthlyRevenueArray = Object.keys(monthlyRevenue).map((month) => ({
			month,
			revenue: monthlyRevenue[month],
		}));

		setMonthlyRevenue(monthlyRevenueArray);
	};

	useEffect(() => {
		fetchOrders();
		fetchUsers();
		fetchProducts();
	}, [session]);

	return (
		<AdminLayout>
			<div className=''>
				<div className='flex flex-wrap justify-center w-full'>
					<Card title='Jumlah User' value={users.length} icon={<FaUsers />} />
					<Card
						title='Jumlah Produk'
						value={products.length}
						icon={<FaBox />}
					/>
					<Card
						title='Jumlah Order'
						value={orders.length}
						icon={<FaShoppingCart />}
					/>
					<Card
						title='Total Penjualan'
						value={`Rp ${revenue.toLocaleString("id-ID")}`}
						icon={<FaDollarSign />}
					/>
				</div>
				<div className='mt-8'>
					<LineChart data={monthlyRevenue} />
				</div>
			</div>
		</AdminLayout>
	);
}
