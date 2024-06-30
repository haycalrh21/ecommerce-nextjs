// import { createContext, useContext } from "react";
// import useSWR from "swr";
// import fetcher from "@/hooks/fetcher";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
// 	const { data, error, mutate } = useSWR(
// 		`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/getuser`,
// 		fetcher,
// 		{
// 			revalidateOnFocus: false, // Optional: disable revalidation on focus
// 		}
// 	);

// 	const user = data?.user;

// 	return (
// 		<UserContext.Provider value={{ user, mutate }}>
// 			{children}
// 		</UserContext.Provider>
// 	);
// };

// export const useUser = () => useContext(UserContext);
