/* eslint-disable array-callback-return */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import "./styles.css";

import { Link } from "@mui/material";
import { useContext } from "react";
import chargeIcon from "../../assets/chargeIcon.svg";
import NoResults from "../../assets/no-results.svg";
import orderIcon from "../../assets/orderIcon.svg";
import UserContext from "../../context/userContext";

export default function ClientsTable({ query, orderClients }) {
  const {
    navigate,
    setCurrentClient,
    showModal,
    setShowModal,
    formCharge,
    setFormCharge,
    setClient,
    clientsList,
  } = useContext(UserContext);

  function handleClientDetail(client) {
    setClient(client);
    setCurrentClient(client);
    navigate("/detail");
  }

  const openModal = (client) => {
    const localFormCharge = { ...formCharge };
    const localShowModal = { ...showModal };

    localFormCharge.name = client.name;
    localFormCharge.clientId = client.id;
    setFormCharge({ ...localFormCharge });

    localShowModal.addCharge = true;
    setShowModal({ ...localShowModal });

    setClient(client);
  };

  function handleGetClients() {
    const localClientsList = [...clientsList];
    const search = localClientsList.filter((client) => {
      if (query === "") {
        return client;
      } else if (
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.cpf.includes(query) ||
        client.email.toLowerCase().includes(query.toLowerCase())
      ) {
        return client;
      }
    });

    return search.length > 0 ? search : false;
  }
  return (
    <TableContainer>
      <Table sx={{ minWidth: 350 }} size='large' aria-label='a dense table'>
        <TableHead>
          <TableRow>
            <TableCell align='left' className='first-headline headlines'>
              <img
                alt='Botão ordenar'
                src={orderIcon}
                onClick={() => orderClients()}
              />
              Cliente
            </TableCell>
            <TableCell className='headlines' align='left'>
              CPF
            </TableCell>
            <TableCell className='headlines' align='left'>
              E-mail
            </TableCell>
            <TableCell className='headlines' align='left'>
              Telefone
            </TableCell>
            <TableCell className='headlines' align='left'>
              Status
            </TableCell>
            <TableCell className='headlines' align='left'>
              Criar Cobrança
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {handleGetClients() &&
            handleGetClients().map((row) => (
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
                  <Link fontWeight='700'>{row.name}</Link>
                </TableCell>
                <TableCell className='data-line' align='left'>
                  {row.cpf}
                </TableCell>
                <TableCell className='data-line' align='left'>
                  {row.email}
                </TableCell>
                <TableCell className='data-line' align='left'>
                  {row.phone}
                </TableCell>
                <TableCell
                  className={!row.status ? "info-red" : "info-green"}
                  align='left'
                >
                  {!row.status ? "Inadimplente" : "Em dia"}
                </TableCell>
                <TableCell align='left'>
                  <img
                    alt='Ícone de cobrança'
                    src={chargeIcon}
                    className='charge-icon'
                    onClick={() => openModal(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          {!handleGetClients() && (
            <TableRow>
              <TableCell colSpan={7} align='center'>
                <img src={NoResults} width='30%' alt='No results' />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
