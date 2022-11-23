import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function DialogWait({ time }) {
	const [open, setOpen] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setOpen(false);
		}, time);
	}, [open, time]);

	return (
		<Backdrop open={open} style={{ backgroundColor: "#FFF" }}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "2rem",
				}}
			>
				<CircularProgress color='secondary' />
				<h1 color='secondary'>Carregando...</h1>
			</div>
		</Backdrop>
	);
}
