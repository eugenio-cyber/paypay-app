import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";
import editImage from "../../assets/btn-edit.svg";
import UsersIcon from "../../assets/users-icon.svg";
import UserContext from "../../context/userContext";
import ChargesClient from "../ChargesClient";
import ModalCharge from "../ModalCharge";
import useStyles from "./styles";
import "./styles.css";

export default function CardClientInfos() {
  const {
    clientCharges,
    formCharge,
    setFormCharge,
    setShowModal,
    showModal,
    handleLoadChargesClient,
    useLocalStorage,
  } = useContext(UserContext);

  const { client, titles, labels, styles } = useStyles();
  const [cliente] = useLocalStorage("cliente");

  function handleEditClient() {
    const localShowModal = { ...showModal };
    localShowModal.addClient = true;
    setShowModal({ ...localShowModal });
  }

  const openModal = (client) => {
    const localFormCharge = { ...formCharge };
    const localShowModal = { ...showModal };

    localFormCharge.name = client.name;
    localFormCharge.clientId = client.id;
    setFormCharge({ ...localFormCharge });

    localShowModal.addCharge = true;
    setShowModal({ ...localShowModal });
  };

  useEffect(() => {
    async function init() {
      await handleLoadChargesClient();
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Container style={{ width: "100%" }}>
        <Grid sx={client.box} item>
          <img
            src={UsersIcon}
            style={{ marginRight: "0.5rem" }}
            alt='icon-clients'
          />
          <h1 style={client.h1}>{cliente.nome}</h1>
        </Grid>
        <Card sx={styles.card}>
          <div className='card-header'>
            <CardHeader title={titles.cliente} />
            <button onClick={() => handleEditClient()} className='card-buttons'>
              <img src={editImage} alt='icon' />
            </button>
          </div>

          <CardContent sx={styles.cardContent}>
            <Grid container sx={{ display: "flex" }}>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>{labels.email}</Typography>
                <Typography>{cliente.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>{labels.telefone}</Typography>
                <Typography>{cliente.telefone}</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>{labels.cpf}</Typography>
                <Typography>{cliente.cpf}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>Endereço</Typography>
                <Typography sx={styles.span}>{cliente.logradouro}</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>Bairro</Typography>
                <Typography sx={styles.span}>{cliente.cep}</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>Complemento</Typography>
                <Typography sx={styles.span}>{cliente.complemento}</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>Bairro</Typography>
                <Typography sx={styles.span}>{cliente.cep}</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Typography sx={styles.titles}>Cidade</Typography>
                <Typography sx={styles.span}>{cliente.cidade}</Typography>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Typography sx={styles.titles}>UF</Typography>
                <Typography sx={styles.span}>{cliente.estado}</Typography>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Typography sx={styles.titles}>CEP</Typography>
                <Typography sx={styles.span}>{cliente.cep}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={styles.card}>
          <div className='card-header'>
            <CardHeader title={styles.cardGrid.header.title} />
            <button className='card-buttons' onClick={() => openModal(cliente)}>
              <img src={styles.buttons.newCharge} alt='icon' />
            </button>
          </div>
          <CardContent sx={styles.cardContent}>
            <Grid container sx={styles.cardGrid.gridLayout}>
              <Grid item sm={11} sx={{ width: "98%" }}>
                <ChargesClient charges={clientCharges} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
      {showModal.editCharge && <ModalCharge />}
    </div>
  );
}
