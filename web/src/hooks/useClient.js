import { useContext } from "react";
import ClientContext from "../contexts/ClientContext";

export default function useClient() {
	return useContext(ClientContext);
}
