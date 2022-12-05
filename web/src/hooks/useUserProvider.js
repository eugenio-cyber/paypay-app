import { useState } from "react";
import {
	Link,
	Navigate,
	Outlet,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";

export default function useUserProvider() {
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState({});
	const [forms, setForms] = useState({
		name: "",
		email: "",
		password: "",
		cpf: "",
		phone: "",
		repeatedPassword: "",
	});

	const [showOption, setShowOption] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [warning, setWarning] = useState({
		active: false,
		message: "",
		type: "error",
	});

	return {
		Link,
		forms,
		setForms,
		showOption,
		setShowOption,
		showModal,
		setShowModal,
		navigate,
		warning,
		setWarning,
		setCurrentUser,
		currentUser,
		Navigate,
		Outlet,
		Route,
		Routes,
	};
}
