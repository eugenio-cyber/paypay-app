/* eslint-disable array-callback-return */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { useContext, useEffect } from "react";
import checkedIcon from "../../assets/checked-2.svg";
import closeIcon from "../../assets/close-2.svg";
import closeIconRed from "../../assets/close-3.svg";
import errorSymbol from "../../assets/ex-symbol.svg";
import NoResults from "../../assets/no-results.svg";
import OrderIcon from "../../assets/orderIcon.svg";
import Pencil from "../../assets/pencil.svg";
import Trash from "../../assets/trash.png";
import UserContext from "../../context/userContext";
import ModalCharge from "../ModalCharge";
import ModalWarning from "../ModalWarning";
import "./styles.css";

let styleTable = {
	width: 1,
	backgroundColor: "#FFFFFF",
	borderRadius: "30px",
	py: "12px",
	px: "23px",
};

const styleTableCell = {
	fontFamily: "Nunito",
	fontStyle: "normal",
	fontWeight: 700,
	fontSize: "16px",
	lineHeight: "50px",
	ml: "17px",

	color: "#3F3F55",
};

const styleTableRow = {
	fontFamily: "Nunito",
	fontStyle: "normal",
	fontWeight: 400,
	fontSize: "14px",
	lineHeight: "40px",
	letterSpacing: "0.005em",

	color: "#6E6E85",
};

function toCurrency(value) {
	return Number(value).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

const TableCharges = ({ query }) => {
	const {
		charges,
		formCharge,
		order,
		setCharges,
		setFormCharge,
		setOrder,
		setShowModal,
		setShowPopupDel,
		showModal,
		showPopupDel,
		showPopupCharge,
		setShowPopupCharge,
	} = useContext(UserContext);

	const openModal = (charge) => {
		const localFormCharge = { ...formCharge };
		const localShowModal = { ...showModal };

		localFormCharge.name = charge.nome;
		localFormCharge.chargeId = charge.id;

		setFormCharge({ ...localFormCharge });

		localShowModal.editCharge = true;
		setShowModal({ ...localShowModal });
	};

	const openAlertModal = (charge) => {
		const localFormCharge = { ...formCharge };
		const localShowModal = { ...showModal };

		localFormCharge.name = charge.nome;
		localFormCharge.chargeId = charge.id;
		setFormCharge({ ...localFormCharge });

		localShowModal.alertCharge = true;
		setShowModal({ ...localShowModal });
	};

	const handleSortCobranca = () => {
		setOrder(!order);
		let localCharges = [...charges];
		localCharges.sort((a, b) => {
			if (order) {
				return a.id - b.id;
			} else {
				return b.id - a.id;
			}
		});
		setCharges([...localCharges]);
	};

	const handleGetCobranca = () => {
		const localCharges = [...charges];

		const search = localCharges.filter((charge) => {
			if (query === "") {
				return charge;
			} else if (
				charge.nome.toLowerCase().includes(query.toLowerCase()) ||
				charge.id.toString().includes(query) ||
				charge.vencimento.toString().includes(query) ||
				charge.status.toLowerCase().includes(query.toLowerCase())
			) {
				return charge;
			}
		});

		return search.length > 0 ? search : false;
	};

	const handleSortCliente = () => {
		setOrder(!order);
		let localCharges = [...charges];
		localCharges.sort((a, b) => {
			if (order) {
				return a.nome.localeCompare(b.nome);
			} else {
				return b.nome.localeCompare(a.nome);
			}
		});
		setCharges([...localCharges]);
	};

	function handleClickE() {
		setShowPopupCharge(true);
	}

	useEffect(() => {}, [charges, query]);

	return (
		<TableContainer>
			<Table sx={styleTable}>
				<TableHead>
					<TableRow>
						<TableCell sx={styleTableCell} align='left'>
							<img
								src={OrderIcon}
								alt='Ícone de ordenação'
								onClick={handleSortCliente}
							/>
							Cliente
						</TableCell>
						<TableCell sx={styleTableCell} align='left'>
							<img
								src={OrderIcon}
								alt='Ícone de ordenação'
								onClick={handleSortCobranca}
							/>
							ID Cob.
						</TableCell>
						<TableCell sx={styleTableCell} align='left'>
							Valor
						</TableCell>
						<TableCell sx={styleTableCell} align='left'>
							Data venc.
						</TableCell>
						<TableCell sx={styleTableCell} align='left'>
							Status
						</TableCell>
						<TableCell sx={styleTableCell} align='left'>
							Descrição
						</TableCell>
						<TableCell sx={styleTableCell} align='left'>
							&nbsp;
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{handleGetCobranca() &&
						handleGetCobranca().map((charge) => (
							<TableRow
								key={charge.id}
								onClick={() => handleClickE()}
							>
								<TableCell sx={styleTableRow} align='left'>
									{charge.nome}
								</TableCell>
								<TableCell sx={styleTableRow} align='left'>
									{charge.id}
								</TableCell>
								<TableCell sx={styleTableRow} align='left'>
									{toCurrency(charge.valor)}
								</TableCell>
								<TableCell sx={styleTableRow} align='left'>
									{charge.vencimento}
								</TableCell>
								<TableCell align='left'>
									<span
										className={`${
											charge.status === "Pendente"
												? "charge-pending"
												: charge.status === "Paga"
												? "charge-paid"
												: "charge-unsuccessful"
										}`}
									>
										{charge.status}
									</span>
								</TableCell>
								<TableCell sx={styleTableRow} align='left'>
									{charge.descricao}
								</TableCell>
								<TableCell>
									<div className='table__icon'>
										<div className='table__icon--edit cursor-pointer'>
											<img
												src={Pencil}
												alt='Ícone editar'
												onClick={() =>
													openModal(charge)
												}
											/>
											<span>Editar</span>
										</div>
										<div className='table__icon--trash cursor-pointer'>
											<img
												src={Trash}
												alt='Ícone lixeira'
												onClick={() =>
													openAlertModal(charge)
												}
											/>
											<span>Excluir</span>
										</div>
									</div>
								</TableCell>
							</TableRow>
						))}
					{!handleGetCobranca() && (
						<TableRow>
							<TableCell colSpan={7} align='center'>
								<img
									src={NoResults}
									width='30%'
									alt='No results'
								/>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{showModal.alertCharge && <ModalWarning />}

			{showModal.editCharge && <ModalCharge />}

			{(showPopupDel.successful || showPopupDel.failed) && (
				<div
					className={
						showPopupDel.successful
							? "successful-register"
							: "failed-register"
					}
				>
					<img
						alt='Ícone da situação'
						src={
							showPopupDel.successful ? checkedIcon : errorSymbol
						}
					/>
					<span>
						{showPopupDel.successful
							? "Cobrança excluída com sucesso!"
							: "Esta cobrança não pode ser excluída!"}
					</span>
					<img
						alt='Botão fechar'
						src={showPopupDel.successful ? closeIcon : closeIconRed}
						className='cursor-pointer'
						onClick={() =>
							setShowPopupDel({
								successful: false,
								failed: false,
							})
						}
					/>
				</div>
			)}

			{showPopupCharge.successful && (
				<div className='successful-register'>
					<img alt='Ícone de checado' src={checkedIcon} />
					<span>Cobrança editada com sucesso</span>
					<img
						alt='Botão fechar'
						src={closeIcon}
						className='cursor-pointer'
						onClick={() => setShowPopupCharge(false)}
					/>
				</div>
			)}
		</TableContainer>
	);
};

export default TableCharges;
