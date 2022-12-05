import { createContext } from "react";
import useUserProvider from "./useUserProvider";

const UserContext = createContext(useUserProvider);

export function UserProvider(props) {
	const provider = useUserProvider();
	return (
		<UserContext.Provider value={provider}>
			{props.children}
		</UserContext.Provider>
	);
}

export default UserContext;
