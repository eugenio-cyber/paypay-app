import BtnNewCharge from "../../assets/btn-charge.svg";

const useStyles = () => {
	return {
		client: {
			nome: "Sara Laje Silva",
			span: {
				fontSize: "1rem",
			},
			h1: {
				fontSize: "2rem",
				fontWeight: 600,
				color: "hsla(240, 15%, 29%, 1)",
			},
			box: {
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				marginBottom: "1rem",
				marginLeft: "0.5rem",
			},
		},
		titles: {
			cliente: "Dados do cliente",
			charges: "Cobranças do Cliente",
		},
		labels: {
			cpf: "CPF",
			email: "Email",
			telefone: "Telefone",
			endereco: "Endereço",
			cidade: "Cidade",
			estado: "Estado",
			cep: "CEP",
		},
		styles: {
			buttons: {
				newCharge: BtnNewCharge,
			},
			card: {
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "flex-start",
				width: "100%",
				minHeight: "250px",
				marginBottom: "2rem",
			},
			cardContent: {
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				width: "100%",
			},
			cardGrid: {
				header: {
					title: "Cobranças do Cliente",
					button: {},
				},
				headerClass: {
					marginTop: "1rem",
					marginLeft: "1rem",
					display: "flex",
					flexDirection: "row",
					fontFamily: "'Montserrat', sans-serif",
					fontSize: "1.6rem",
				},
				gridLayout: {
					height: "300px",
					display: "flex",
					justifyContent: "center",
					overflowY: "auto",
				},
			},
			titles: {
				fontFamily: "Nunito, sans-serif",
				fontSize: "1.2rem",
				fontWeight: 700,
			},
		},
	};
};
export default useStyles;
