import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useContext, useEffect, useState } from "react";
import IconEdit from "../../assets/icon-edit.svg";
import IconDelete from "../../assets/icon-excluir.svg";
import NoResults from "../../assets/no-results.svg";
import orderIcon from "../../assets/orderIcon.svg";
import UserContext from "../../context/userContext";
import { dateToStringConverter } from "../../utils/functions";
import ModalCharge from "../ModalCharge";
import ModalWarning from "../ModalWarning";

import "./styles.css";

export default function ChargesClient() {
  const {
    navigate,
    order,
    setOrder,
    showModal,
    setShowModal,
    formCharge,
    setCurrentClient,
    setFormCharge,
    useLocalStorage,
    clientCharges,
  } = useContext(UserContext);

  const [cliente] = useLocalStorage("cliente");
  const [chargesClient, setChargesClient] = useState([]);

  function handleClientDetail(persistClient) {
    setCurrentClient(persistClient);
    navigate("/detail");
  }

  function handleOrderId() {
    setOrder(!order);

    const chargesSorted = chargesClient.sort((a, b) => {
      return order ? a.id - b.id : b.id - a.id;
    });
    setChargesClient(chargesSorted);
    return;
  }

  function handleOrderDate() {
    setOrder(!order);

    const chargesSorted = chargesClient.sort((a, b) => {
      return order
        ? +new Date(a.vencimento) - +new Date(b.vencimento)
        : +new Date(b.vencimento) - +new Date(a.vencimento);
    });
    setChargesClient(chargesSorted);
    return;
  }

  const openEditModal = (charge) => {
    const localFormCharge = { ...formCharge };
    const localShowModal = { ...showModal };

    localFormCharge.name = cliente.nome;
    localFormCharge.chargeId = charge.id;
    setFormCharge({ ...localFormCharge });

    localShowModal.editCharge = true;
    setShowModal({ ...localShowModal });
  };

  const openAlertModal = (chargeId) => {
    const localFormCharge = { ...formCharge };
    const localShowModal = { ...showModal };

    localFormCharge.chargeId = chargeId;
    setFormCharge({ ...localFormCharge });

    localShowModal.alertCharge = true;
    setShowModal({ ...localShowModal });
  };

  useEffect(() => {
    setChargesClient(clientCharges);
  }, [cliente, clientCharges]);

  return (
    <TableContainer className='MuiTableContainer-root-1'>
      <Table
        sx={{ minWidth: 350, fontSize: "1.6rem" }}
        size='large'
        aria-label='a dense table'
      >
        <TableHead>
          <TableRow>
            <TableCell
              align='center'
              sortDirection='desc'
              className='headlines'
            >
              <div className='icons-order-charges'>
                <img
                  alt='Botão ordenar'
                  src={orderIcon}
                  onClick={handleOrderId}
                />
                <span>ID Cob.</span>
              </div>
            </TableCell>
            <TableCell className='headlines' align='left'>
              <div className='icons-order-charges'>
                <img
                  alt='Botão ordenar'
                  src={orderIcon}
                  onClick={handleOrderDate}
                />
                <span>Data de venc.</span>
              </div>
            </TableCell>
            <TableCell className='headlines' align='left'>
              Valor
            </TableCell>
            <TableCell className='headlines' align='left'>
              Status
            </TableCell>
            <TableCell className='headlines' align='left'>
              Descrição
            </TableCell>
            <TableCell className='headlines' align='left'>
              &nbsp;
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chargesClient.length > 0 ? (
            chargesClient.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell
                  className='data-line name-column'
                  component='th'
                  scope='row'
                  onClick={() => handleClientDetail(row)}
                >
                  <Typography sx={{ color: "#000" }} fontWeight='700'>
                    {row.id}
                  </Typography>
                </TableCell>
                <TableCell className='data-line' align='center'>
                  {dateToStringConverter(row.due)}
                </TableCell>
                <TableCell className='data-line' align='center'>
                  {row.value}
                </TableCell>
                <TableCell
                  className={!row.status ? "info-red" : "info-green"}
                  align='left'
                >
                  {!row.status ? "Inadimplente" : "Em dia"}
                </TableCell>
                <TableCell className='data-line' align='left'>
                  {row.description}
                </TableCell>
                <TableCell align='center'>
                  <div className='icons-actions-charges'>
                    <img
                      alt='Ícone de editar'
                      src={IconEdit}
                      className='edit-icon'
                      onClick={() => openEditModal(row)}
                    />
                    <img
                      alt='Ícone de excluir'
                      src={IconDelete}
                      className='delete-icon'
                      onClick={() => openAlertModal(row.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align='center'>
                <img src={NoResults} width='30%' alt='No results' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {showModal.editCharge && <ModalCharge iconEdit={true} />}

      {showModal.alertCharge && <ModalWarning />}
    </TableContainer>
  );
}
