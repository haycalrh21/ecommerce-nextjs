import React, { useEffect, useState } from "react";
import { AdminDashboard } from "../AdminLayout";

export default function AdminUser() {
	const [users, setUsers] = useState([]);

	const dataUser = async () => {
		const response = await fetch("/api/user");
		const data = await response.json();
		setUsers(data);
		console.log(data);
	};

	useEffect(() => {
		dataUser();
	}, []);
	return (
		<AdminDashboard>
			<div>
				<h1>Admin User</h1>
				<div>
					<table>
						<thead>
							<tr>
								<th>name</th>
								<th>email</th>
								<th>role</th>
								<th>aksi</th>
							</tr>
						</thead>
						<tbody>
							{users.map((users) => (
								<tr key={users._id}>
									<td>{users.name}</td>
									<td>{users.email}</td>
									<td>{users.role}</td>
									<td>delete</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</AdminDashboard>
	);
}
