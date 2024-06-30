import axios from "axios";

axios.interceptors.response.use(
	(response) => {
		return response;
	}
	// (error) => {
	// 	if (error.response && error.response.status === 401) {
	// 		// console.error("Unauthorized access detected. Logging out user...");
	// 		// Handle unauthorized access globally, e.g., logout user
	// 		// Optionally, you can return null or handle as needed
	// 		return Promise.resolve(null);
	// 	}
	// 	return Promise.reject(error); // Rethrow other errors
	// }
);

export default axios;
