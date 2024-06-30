import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
	const session = await getSession(context);

	// Periksa apakah session ada dan user memiliki role admin
	if (!session || session.user.role !== "admin") {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	// Jika session ada dan user memiliki role admin, lanjutkan ke halaman admin dashboard
	return {
		props: {}, // Jika perlu, Anda bisa menyertakan props tambahan untuk halaman admin dashboard di sini
	};
}

const Dashboard = () => {
	return (
		<div>
			<h1 className='mt-20'>Admin Dashboard</h1>
			{/* Konten halaman dashboard admin */}
		</div>
	);
};

export default Dashboard;
