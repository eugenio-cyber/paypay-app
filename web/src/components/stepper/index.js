import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import "./stepper.css";

import greenCircle from "../../assets/greenCircle.svg";
import checkCircle from "../../assets/StepChecked.svg";
import verticalBar from "../../assets/verticalLine.svg";
import whiteCircle from "../../assets/whiteCircle.svg";

const steps = [
	{
		label: "Cadastre-se",
		description: `Por favor, escreva seu nome e e-mail`,
	},
	{
		label: "Escolha uma senha",
		description: "Escolha uma senha segura",
	},
	{
		label: "Cadastro realizado com sucesso",
		description: `E-mail e senha cadastrados com sucesso`,
	},
];

export default function VerticalLinearStepper({ stepPage }) {
	function changeIcon(index) {
		if (index !== 2) {
			if (stepPage > index + 1) {
				return checkCircle;
			} else if (stepPage > index) {
				return greenCircle;
			} else {
				return whiteCircle;
			}
		} else {
			if (stepPage === 3) {
				return checkCircle;
			} else {
				return whiteCircle;
			}
		}
	}

	return (
		<Box sx={{ maxWidth: 400 }}>
			<Stepper orientation='vertical'>
				{steps.map((step, index) => (
					<Step key={step.label}>
						<StepLabel
							icon={
								<img
									alt='Imagem circulo'
									src={changeIcon(index)}
									className='circle-img'
								/>
							}
						>
							<Typography className='step-label'>
								{step.label}
							</Typography>
						</StepLabel>
						<div className='step-desc'>
							{index < 2 && (
								<img alt='barra vertical' src={verticalBar} />
							)}
							<Typography className='step-desc__desc'>
								{step.description}
							</Typography>
						</div>
					</Step>
				))}
			</Stepper>
		</Box>
	);
}
