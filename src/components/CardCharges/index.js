import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useContext, useEffect } from "react";
import UserContext from "../../context/userContext";
import { topCell } from "../../global";
import "./styles.css";

const CardChares = ({
	img,
	background,
	title,
	subtitle,
	topic,
	number,
	colorNumber,
	backgroundNumber,
	list,
	toCurrency,
	status,
}) => {
	const { setStatusCharges, navigate } = useContext(UserContext);
	function handleChargeStatus() {
		setStatusCharges(status);
		navigate("/charges");
	}
	useEffect(() => {}, [list]);

	return (
		<div className='card-charges'>
			<div
				className='card-charges__top'
				style={{ background: background }}
			>
				<img
					className='card-charges__img'
					src={img}
					alt='Ícone cobranças pagas'
				/>
				<div className='card-charges__text'>
					<span className='card-charges__title'>{title}</span>
					<span className='card-charges__subtitle'>{subtitle}</span>
				</div>
			</div>
			<div className='card-charges__content'>
				<div className='card-charges__header'>
					<span className='card-charges__topic'>{topic}</span>
					<span
						className='card-charges__number'
						style={{
							background: backgroundNumber,
							color: colorNumber,
						}}
					>
						{number}
					</span>
				</div>
				<TableContainer sx={{ borderBottom: "1px solid #EFF0F7" }}>
					<Table sx={{ width: 1 }} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell align='center' style={topCell}>
									Cliente
								</TableCell>
								<TableCell align='center' style={topCell}>
									ID da cob.
								</TableCell>
								<TableCell align='center' style={topCell}>
									Valor
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{list &&
								list.map((item) => (
									<TableRow
										key={item.ch_id}
										sx={{
											"&:last-child td, &:last-child th":
												{
													border: 0,
												},
										}}
									>
										<TableCell align='center'>
											{item.nome}
										</TableCell>
										<TableCell align='center'>
											{item.ch_id}
										</TableCell>
										<TableCell align='center'>
											{toCurrency(item.valor)}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<div className='card-charges__more'>
					<span
						className='cursor-pointer'
						onClick={() => handleChargeStatus()}
					>
						Ver todos
					</span>
				</div>
			</div>
		</div>
	);
};

export default CardChares;
