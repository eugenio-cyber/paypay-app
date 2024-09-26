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

const CardClients = ({
  img,
  title,
  number,
  colorNumber,
  backgroundNumber,
  rows,
  toCurrency,
  status,
}) => {
  const { navigate, setStatusClient } = useContext(UserContext);

  function handleFilterClient() {
    setStatusClient(status);
    navigate("/clients");
  }

  useEffect(() => {}, [rows]);
  return (
    <div className='card-clients'>
      <div className='card-clients__header'>
        <div className='card-clients__title'>
          <img src={img} alt='Ícone cliente' />
          <span className='card-clients__text'>{title}</span>
        </div>
        <span
          className='card-clients__number'
          style={{ background: backgroundNumber, color: colorNumber }}
        >
          {number}
        </span>
      </div>
      <TableContainer sx={{ borderBottom: "1px solid #EFF0F7" }}>
        <Table
          sx={{ width: 1 }}
          aria-label='simple table'
          className='simple-table'
        >
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
            {rows &&
              rows.map((row) => (
                <TableRow
                  key={row.ch_id}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell align='center' color='black'>
                    {row.nome}
                  </TableCell>
                  <TableCell align='center'>{row.ch_id}</TableCell>
                  <TableCell align='center'>{toCurrency(row.valor)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='card-clients__more'>
        <span className='cursor-pointer' onClick={() => handleFilterClient()}>
          Ver todos
        </span>
      </div>
    </div>
  );
};

export default CardClients;
