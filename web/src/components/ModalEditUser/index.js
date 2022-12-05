import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import Close from "../../assets/close.svg";
import Success from "../../assets/success.svg";
import userContext from "../../context/userContext";
import { alert } from "../../global";
import BasicButtons from "../Button";
import Input from "../Input";

import api from "../../services/api";
import { box, boxInput, boxSuccess, modal, title } from "./styles";
import "./styles.css";

function verifyWhiteSpace(string) {
	return /\s/g.test(string);
}

function lengthString(string) {
	return string.length < 11 || (string.length > 11 && string.length < 14);
}

function lengthStringSenha(string) {
	return string.length < 6;
}

export default function ModalEditUser({ getUser }) {
	const {
		forms,
		warning,
		setWarning,
		showModal,
		setShowModal,
		getItem,
		useLocalStorage,
	} = useContext(userContext);

	const [usuario] = useLocalStorage("usuario");
	const [showSuccess, setShowSuccess] = useState(false);

	const handleCloseModal = () => {
		const localShowModal = { ...showModal };
		localShowModal.editUser = false;
		setShowModal({ ...localShowModal });
	};

	const handleSubmit = async (e) => {
		const localWarning = { ...warning };
		e.preventDefault();

		if (
			verifyWhiteSpace(forms.senha) ||
			verifyWhiteSpace(forms.email) ||
			verifyWhiteSpace(forms.cpf) ||
			verifyWhiteSpace(forms.phone)
		) {
			localWarning.active = true;
			localWarning.message =
				"Os campos não podem possuir espaços em branco";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);

			return;
		}

		if (forms.password !== forms.repeatedPassword) {
			localWarning.active = true;
			localWarning.message = "As senhas não coincidem";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);

			return;
		}

		if (forms.password) {
			if (lengthStringSenha(forms.password)) {
				localWarning.active = true;
				localWarning.message =
					"A senha precisa ter no mínimo 6 digitos";

				setWarning({ ...localWarning });

				setTimeout(() => {
					localWarning.active = false;
					localWarning.message = "";

					setWarning({ ...localWarning });
				}, 4000);

				return;
			}
		}

		if (forms.cpf && lengthString(forms.cpf)) {
			localWarning.active = true;
			localWarning.message =
				"O CPF informado não é válido, ex: 99999999999";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);
			return;
		}

		if (
			forms.phone &&
			(forms.phone.length < 11 || forms.phone.length > 16)
		) {
			localWarning.active = true;
			localWarning.message =
				"O telefone informado é inválido, ex: 99999999999";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);
			return;
		}

		const data = {};

		if (forms.name && forms.name !== usuario.nome) {
			data.nome = forms.name;
		}

		if (forms.cpf && forms.cpf !== usuario.cpf) {
			data.cpf = forms.cpf;
		}

		if (forms.email && forms.phone !== usuario.email) {
			data.email = forms.email;
		}

		if (forms.phone && forms.phone !== usuario.telefone) {
			data.telefone = forms.phone;
		}

		if (forms.password) {
			data.senha = forms.password;
		}

		try {
			await api.patch("/users", data, {
				headers: {
					Authorization: "Bearer " + getItem("token"),
				},
			});

			setShowSuccess(true);

			setTimeout(() => {
				setShowSuccess(false);
				handleCloseModal();
			}, 2000);

			await getUser();
		} catch (error) {
			const localWarning = { ...warning };
			localWarning.active = true;
			localWarning.message = error.response.data;

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";
				setWarning({ ...localWarning });
			}, 4000);
		}
	};

	return (
		<>
			<Modal
				open={showModal.editUser}
				onClose={() => handleCloseModal()}
				sx={modal}
			>
				<Box sx={box}>
					{showSuccess && (
						<Box component='div' style={boxSuccess}>
							<img src={Success} alt='Imagem de sucesso' />
							<Typography
								id='modal-modal-title'
								variant='h1'
								style={title}
							>
								Cadastro Alterado com sucesso!
							</Typography>
						</Box>
					)}

					{!showSuccess && (
						<>
							<Typography
								id='modal-modal-title'
								variant='h1'
								style={title}
							>
								Edite seu cadastro
							</Typography>
							<img
								className='modal__close cursor-pointer'
								src={Close}
								alt='Botão fechar'
								onClick={() => handleCloseModal()}
							/>
							<form className='form' onSubmit={handleSubmit}>
								<Input
									label='Nome*'
									width='379px'
									type='text'
									id='name'
									placeholder='Digite seu nome'
									inputName='name'
									defaultValue={usuario.nome}
								/>
								<Input
									label='Email*'
									width='379px'
									type='email'
									id='email'
									placeholder='Digite seu e-mail'
									inputName='email'
									defaultValue={usuario.email}
								/>
								<Box component='div' style={boxInput}>
									<Input
										label='CPF'
										width='178px'
										type='number'
										id='cpf'
										placeholder='Digite seu CPF'
										inputName='cpf'
										isRequired={false}
										defaultValue={usuario.cpf}
									/>
									<Input
										label='Telefone'
										width='178px'
										type='number'
										id='phone'
										placeholder='Digite seu Telefone'
										inputName='phone'
										defaultValue={usuario.telefone}
										isRequired={false}
									/>
								</Box>
								<Input
									label='Nova Senha*'
									width='379px'
									type='password'
									id='new-password'
									placeholder=''
									inputName='password'
									eyeIcon={true}
								/>
								<Input
									label='Confirmar Senha*'
									width='379px'
									type='password'
									id='confirm-password'
									placeholder=''
									inputName='repeatedPassword'
									eyeIcon={true}
								/>
								<BasicButtons
									variant='contained'
									action='Continuar'
									width='160px'
								/>
							</form>
						</>
					)}
				</Box>
			</Modal>

			{warning.active && (
				<Alert variant='filled' severity={warning.type} sx={alert}>
					{warning.message}
				</Alert>
			)}
		</>
	);
}
