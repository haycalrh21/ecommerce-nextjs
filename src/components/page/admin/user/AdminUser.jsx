import React, { useEffect, useState } from "react";
import { AdminDashboard, AdminLayout } from "../AdminLayout";
import { useSession } from "next-auth/react";

export default function AdminUser() {
	const { data: session, status } = useSession();
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			if (session) {
				const res = await fetch("/api/user", {
					headers: {
						Authorization: `Bearer ${session.accessToken}`,
					},
				});
				const data = await res.json();
				setUsers(data);
			}
		};

		fetchUsers();
	}, [session]);

	if (status === "loading") return <p>Loading...</p>;
	if (!session) return <p>Please log in</p>;

	return (
		<AdminLayout>
			<div>
				<h1>Admin User</h1>

				<div className='overflow-x-auto'>
					<table className='min-w-full bg-white'>
						<thead>
							<tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
								<th className='py-3 px-6 text-left'>Name</th>
								<th className='py-3 px-6 text-left'>Email</th>
								<th className='py-3 px-6 text-left'>role</th>
								<th className='py-3 px-6 text-left'>action</th>
							</tr>
						</thead>
						<tbody className='text-gray-600 text-sm font-light'>
							{users.map((user) => (
								<tr
									key={user._id}
									className='border-b border-gray-200 hover:bg-gray-100'
								>
									<td className='py-3 px-6 text-left'>{user.name}</td>
									<td className='py-3 px-6 text-left'>{user.email}</td>
									<td className='py-3 px-6 text-left'>{user.role}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</AdminLayout>
	);
}
