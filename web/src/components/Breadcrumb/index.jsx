import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

export default function ClientBreadcrumbs() {
  function handleClick(e) {
    e.preventDefault();
    localStorage.removeItem("cliente");
  }

  return (
    <div role='presentation' onClick={handleClick}>
      <Breadcrumbs
        aria-label='breadcrumb'
        separator={<NavigateNextIcon fontSize='small' />}
      >
        <NavLink to={"/clients"} className='navlink'>
          Clientes
        </NavLink>
        <Typography color='hsla(240, 9%, 48%, 1);'>
          Detalhes do Cliente
        </Typography>
      </Breadcrumbs>
    </div>
  );
}
