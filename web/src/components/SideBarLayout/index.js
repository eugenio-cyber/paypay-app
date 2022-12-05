import { Outlet, useLocation } from "react-router-dom";
import ChargesSelected from "../../assets/charges-selected.svg";
import Charges from "../../assets/charges.svg";
import ClientsSelected from "../../assets/clients-selected.svg";
import Clients from "../../assets/clients.svg";
import HomeSelected from "../../assets/home-selected.svg";
import Home from "../../assets/home.svg";
import "./styles.css";

import { useContext } from "react";
import UserContext from "../../context/userContext";

const SideBarLayout = () => {
	const {
		navigate,
		setShowOption,
		setStatusCharges,
		getCharges,
		showClients,
	} = useContext(UserContext);

	const location = useLocation();

	function redirectPages(page) {
		if (page === "clients") {
			showClients();
			localStorage.removeItem("cliente");
		}
		setShowOption(false);
		navigate("/" + page);
		getCharges();
		setStatusCharges("");
	}

	return (
		<div className='container'>
			<div className='side-bar'>
				<div
					className='side-bar__group'
					style={{
						borderRight:
							location.pathname === "/home" &&
							"2px solid var(--purple)",
					}}
					onClick={() => redirectPages("home")}
				>
					<img
						src={
							location.pathname === "/home" ? HomeSelected : Home
						}
						alt='Ícone home'
					/>
					<span
						className='side-bar__text'
						style={{
							color:
								location.pathname === "/home"
									? "var(--purple)"
									: "var(--grey-primary)",
						}}
					>
						Home
					</span>
				</div>
				<div
					className='side-bar__group'
					style={{
						borderRight:
							location.pathname === "/clients" ||
							location.pathname === "/detail"
								? "2px solid var(--purple)"
								: "",
					}}
					onClick={() => redirectPages("clients")}
				>
					<img
						src={
							location.pathname === "/clients" ||
							location.pathname === "/detail"
								? ClientsSelected
								: Clients
						}
						alt='Ícone clientes'
					/>
					<span
						className='side-bar__text'
						style={{
							color:
								location.pathname === "/clients" ||
								location.pathname === "/detail"
									? "var(--purple)"
									: "var(--grey-primary)",
						}}
					>
						Clientes
					</span>
				</div>
				<div
					className='side-bar__group'
					style={{
						borderRight:
							location.pathname === "/charges" &&
							"2px solid var(--purple)",
					}}
					onClick={() => redirectPages("charges")}
				>
					<img
						src={
							location.pathname === "/charges"
								? ChargesSelected
								: Charges
						}
						alt='Ícone cobranças'
					/>
					<span
						className='side-bar__text'
						style={{
							color:
								location.pathname === "/charges"
									? "var(--purple)"
									: "var(--grey-primary)",
						}}
					>
						Cobranças
					</span>
				</div>
			</div>
			<div className='pages'>
				<Outlet />
			</div>
		</div>
	);
};

export default SideBarLayout;
