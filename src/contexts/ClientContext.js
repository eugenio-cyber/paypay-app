import { createContext } from "react";
import useClientProvider from "../hooks/useClientProvider";

const ClientContext = createContext(useClientProvider);

export function ClientProvider(props) {
	const clientProvider = useClientProvider();
	return (
		<ClientContext.Provider value={clientProvider}>
			{props.children}
		</ClientContext.Provider>
	);
}
export default ClientContext;
