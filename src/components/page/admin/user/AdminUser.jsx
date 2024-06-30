import React, { useEffect, useState } from "react";
import { AdminDashboard } from "../AdminLayout";
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
		<AdminDashboard>
			<div>
				<h1>Admin User</h1>
				<div>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Role</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user._id}>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.role}</td>
									<td>Delete</td>{" "}
									{/* Tambahkan fungsi delete jika diperlukan */}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</AdminDashboard>
	);
}
