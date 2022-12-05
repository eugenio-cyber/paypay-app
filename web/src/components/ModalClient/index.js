import "./styles.css";

import clientsIcon from "../../assets/clients2.svg";
import closeIcon from "../../assets/close.svg";

import { useContext, useEffect, useState } from "react";
import Input from "../../components/Input";
import UserContext from "../../context/userContext";
import { alert } from "../../global";
import api from "../../services/api";
import BasicButtons from "../Button";

function ModalClient({ showClients, editClient }) {
	const {
		Alert,
		forms,
		getItem,
		setForms,
		setShowModal,
		setShowPopup,
		setShowPopupEdit,
		setWarning,
		viaCep,
		warning,
		useLocalStorage,
	} = useContext(UserContext);

	const [cliente] = useLocalStorage("cliente");
	const [errorInput, setErrorInput] = useState(false);

	function handleClose() {
		setForms({
			name: "",
			email: "",
			password: "",
			repeatedPassword: "",
			cpf: "",
			phone: "",
			address: "",
			complement: "",
			cep: "",
			neighborhood: "",
			city: "",
			uf: "",
		});

		setShowModal(false);
	}

	async function handleAddClient(evt) {
		evt.preventDefault();
		const localWarning = { ...warning };

		if (
			!forms.name.trim() ||
			!forms.email.trim() ||
			!forms.cpf.trim() ||
			!forms.phone.trim()
		) {
			setErrorInput(true);

			localWarning.active = true;
			localWarning.message =
				"Os campos com (*) não podem possuir espaços em branco";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);

			return;
		}

		if (forms.cpf.length < 11) {
			localWarning.active = true;
			localWarning.message =
				"O CPF deve ter no mínimo 11 dígitos e no máximo 14.";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);

			return;
		}

		try {
			await api.post(
				"/clients",
				{
					nome: forms.name,
					email: forms.email,
					cpf: forms.cpf,
					telefone: forms.phone,
					logradouro: forms.address,
					complemento: forms.complement,
					cep: forms.cep,
					bairro: forms.neighborhood,
					cidade: forms.city,
					estado: forms.uf,
				},
				{
					headers: {
						Authorization: "Bearer " + getItem("token"),
					},
				}
			);

			setShowModal(false);

			await showClients();

			setTimeout(() => {
				setShowPopup(true);
			}, 1000);

			setTimeout(() => {
				setShowPopup(false);
			}, 10000);
		} catch (error) {
			localWarning.active = true;
			localWarning.message = error.response.data;

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);
		}
	}

	async function handleEditClient(evt) {
		evt.preventDefault();

		const localWarning = { ...warning };

		if (
			!forms.name.trim() ||
			!forms.email.trim() ||
			!forms.cpf.trim() ||
			!forms.phone.trim()
		) {
			setErrorInput(true);

			localWarning.active = true;
			localWarning.message =
				"Os campos com (*) não podem possuir espaços em branco";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);

			return;
		}

		if (forms.cpf.length < 11) {
			localWarning.active = true;
			localWarning.message =
				"O CPF deve ter no mínimo 11 dígitos e no máximo 14.";

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);

			return;
		}

		const request = {};

		if (forms.name !== cliente.nome) {
			request.nome = forms.name;
		}

		if (forms.email !== cliente.email) {
			request.email = forms.email;
		}

		if (forms.cpf !== cliente.cpf) {
			request.cpf = forms.cpf;
		}

		if (forms.phone !== cliente.telefone) {
			request.telefone = forms.phone;
		}

		if (forms.address !== cliente.logradouro) {
			request.logradouro = forms.address;
		}

		if (forms.complement !== cliente.complemento) {
			request.complemento = forms.complement;
		}

		if (forms.cep !== cliente.cep) {
			request.cep = forms.cep;
		}

		if (forms.neighborhood !== cliente.bairro) {
			request.bairro = forms.neighborhood;
		}

		if (forms.city !== cliente.cidade) {
			request.cidade = forms.city;
		}

		if (forms.uf !== cliente.estado) {
			request.estado = forms.uf;
		}

		try {
			await api.patch(`/clients/${cliente.id}`, request, {
				headers: {
					Authorization: "Bearer " + getItem("token"),
				},
			});

			setShowModal(false);

			setTimeout(() => {
				setShowPopupEdit(true);
			}, 1000);

			setTimeout(() => {
				setShowPopupEdit(false);
			}, 10000);
		} catch (error) {
			localWarning.active = true;
			localWarning.message = error.response.data;

			setWarning({ ...localWarning });

			setTimeout(() => {
				localWarning.active = false;
				localWarning.message = "";

				setWarning({ ...localWarning });
			}, 4000);
		}
	}

	useEffect(() => {
		if (viaCep.cep.length === 8) {
			setForms({
				...forms,
				cep: viaCep.cep,
				address: viaCep.logradouro,
				complement: viaCep.complemento,
				neighborhood: viaCep.bairro,
				city: viaCep.localidade,
				uf: viaCep.uf,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viaCep]);

	useEffect(() => {
		if (editClient === true) {
			setForms({
				name: cliente.nome,
				email: cliente.email,
				cpf: cliente.cpf,
				phone: cliente.telefone,
				address: cliente.logradouro,
				complement: cliente.complemento,
				cep: cliente.cep,
				neighborhood: cliente.bairro,
				city: cliente.cidade,
				uf: cliente.estado,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='container-modal'>
			<div className='add-card'>
				<img
					alt='Botão fechar'
					src={closeIcon}
					className='close-icon'
					onClick={() => handleClose()}
				/>

				<div className='head-card'>
					<img alt='Ícone cliente' src={clientsIcon} />
					<h1>
						{editClient === false
							? "Cadastro do Cliente"
							: "Editar Cliente"}{" "}
					</h1>
				</div>

				<form
					className='form-modal'
					onSubmit={
						editClient === false
							? handleAddClient
							: handleEditClient
					}
				>
					<Input
						label='Nome*'
						width={460}
						type='text'
						id='nome'
						placeholder='Digite o nome'
						inputName='name'
						errorInput={forms.name ? false : errorInput}
						defaultValue={!editClient ? "" : cliente.nome}
					/>

					<Input
						label='E-mail*'
						width={460}
						type='email'
						id='email'
						placeholder='Digite seu e-mail'
						inputName='email'
						errorInput={forms.email ? false : errorInput}
						defaultValue={!editClient ? "" : cliente.email}
					/>

					<div className='inputs-numbers'>
						<Input
							label='CPF*'
							width={210}
							type='text'
							id='cpf'
							placeholder='Digite o CPF'
							inputName='cpf'
							errorInput={forms.cpf ? false : errorInput}
							defaultValue={!editClient ? "" : cliente.cpf}
						/>

						<Input
							label='Telefone*'
							width={210}
							type='text'
							id='phone'
							placeholder='Digite o telefone'
							inputName='phone'
							errorInput={forms.phone ? false : errorInput}
							defaultValue={!editClient ? "" : cliente.telefone}
						/>
					</div>

					<Input
						label='Endereço'
						width={460}
						type='text'
						id='address'
						placeholder='Digite o endereço'
						inputName='address'
						defaultValue={!editClient ? "" : cliente.logradouro}
					/>

					<Input
						label='Complemento'
						width={460}
						type='text'
						id='complement'
						placeholder='Digite o complemento'
						inputName='complement'
						defaultValue={!editClient ? "" : cliente.complemento}
					/>

					<div className='inputs-numbers'>
						<Input
							label='CEP'
							width={210}
							type='text'
							id='cep'
							placeholder='Digite o CEP'
							inputName='cep'
							defaultValue={!editClient ? "" : cliente.cep}
						/>

						<Input
							label='Bairro'
							width={210}
							type='text'
							id='neighborhood'
							placeholder='Digite o bairro'
							inputName='neighborhood'
							defaultValue={!editClient ? "" : cliente.bairro}
						/>
					</div>

					<div className='inputs-numbers'>
						<Input
							label='Cidade'
							width={210}
							type='text'
							id='city'
							placeholder='Digite a cidade'
							inputName='city'
							defaultValue={!editClient ? "" : cliente.cidade}
						/>

						<Input
							label='UF'
							width={210}
							type='text'
							id='uf'
							placeholder='Digite a UF'
							inputName='uf'
							defaultValue={!editClient ? "" : cliente.estado}
						/>
					</div>

					<div className='btn-area'>
						<button
							type='button'
							className='btn-cancel'
							onClick={() => handleClose()}
						>
							Cancelar
						</button>

						<BasicButtons
							variant='contained'
							action='Aplicar'
							width={220}
						/>
					</div>
				</form>
			</div>
			{warning.active && (
				<Alert variant='filled' severity={warning.type} sx={alert}>
					{warning.message}
				</Alert>
			)}
		</div>
	);
}

export default ModalClient;
