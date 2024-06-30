import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	// console.log(session);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status]);
	return (
		<div className='mt-20'>
			<h1>Welcome, {session?.user?.name}</h1>
		</div>
	);
};

export default Dashboard;
