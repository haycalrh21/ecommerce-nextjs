import AdminDashboard from "@/components/page/admin/dashboard/AdminDashboard";

import { useSession } from "next-auth/react";

const Dashboard = () => {
	const { data: session, status } = useSession();

	if (session?.user?.role !== "admin" || status !== "authenticated") {
		return null;
	}
	return <AdminDashboard />;
};

export default Dashboard;
