import "./styles.css";

import { useContext, useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import ArrowDown from "../../assets/arrow-down.svg";
import ArrowUp from "../../assets/arrow-up.svg";
import Avatar from "../../assets/avatar.svg";
import BillingAccepted from "../../assets/billing-accepted.png";
import Charge from "../../assets/charges.svg";
import Close from "../../assets/close.svg";
import Filters from "../../assets/frames.svg";
import Leave from "../../assets/leave.svg";
import Pencil from "../../assets/pencil.svg";
import DialogWait from "../../components/Dialog";
import ModalEditUser from "../../components/ModalEditUser";
import TableCharges from "../../components/TableCharges";

import UserContext from "../../context/userContext";
import { removeItem } from "../../utils/storage";

const Charges = () => {
  const {
    navigate,
    showModal,
    setShowModal,
    showOption,
    setShowOption,
    currentUser,
    warning,
    setWarning,
    getUser,
    getCharges,
  } = useContext(UserContext);

  const [query, setQuery] = useState("");

  const handleExit = () => {
    setShowOption(false);
    removeItem("token");
    navigate("/");
  };

  const handleClickEditUser = () => {
    const localShowModal = { ...showModal };
    localShowModal.editUser = true;
    setShowModal({ ...localShowModal });
    setShowOption(false);
  };

  const closeWarning = () => {
    const localWarning = { ...warning };

    localWarning.active = false;
    localWarning.message = "";
    localWarning.type = "error";

    setWarning({ ...localWarning });
  };

  useEffect(() => {
    getUser();
    getCharges();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='charges'>
      <header className='header'>
        <span className='header-line'>Cobranças</span>
        <div className='header__user'>
          <img className='header__avatar' src={Avatar} alt='Avatar' />
          <span className='header__username'>{currentUser.nome}</span>
          <img
            className='cursor-pointer'
            src={ArrowDown}
            alt='Seta pra baixo'
            onClick={() => setShowOption(!showOption)}
          />
          {showOption && (
            <div className='options'>
              <div
                className='options__group'
                onClick={() => handleClickEditUser()}
              >
                <img src={Pencil} alt='Caneta' />
                <span className='options__text'>Editar</span>
                <img
                  className='options__arrow-up'
                  src={ArrowUp}
                  alt='Seta pra cima'
                />
              </div>
              <div className='options__group' onClick={() => handleExit()}>
                <img src={Leave} alt='Sair' />
                <span className='options__text'>Sair</span>
              </div>
            </div>
          )}
        </div>
      </header>
      <section className='charges-top'>
        <div className='charges-title'>
          <img
            className='charges-title__img'
            src={Charge}
            alt='Imagem de cobrança'
          />
          <h1 className='charges-title__text'>Cobranças</h1>
        </div>
        <div className='charges-action'>
          <img
            className='charges-action__img cursor-pointer'
            src={Filters}
            alt='Botão filtrar'
          />
          <InputBase
            className='charges-action__input'
            value={query}
            placeholder='Pesquisar'
            onChange={(e) => setQuery(e.target.value)}
            endAdornment={<SearchIcon />}
          />
        </div>
      </section>
      <main className='charges-table'>
        <TableCharges query={query} />
      </main>
      {warning.active && warning.type === "alert" && (
        <div className='warning-charge'>
          <img src={BillingAccepted} alt='Cobrança aceita' />
          <span className='warning-charge__text'>{warning.message}</span>
          <img
            className='warning-charge__img cursor-pointer'
            src={Close}
            alt='Botão fechar'
            onClick={() => closeWarning()}
          />
        </div>
      )}
      <DialogWait time={1200} />
      {showModal.editUser && <ModalEditUser getUser={getUser} />}
    </div>
  );
};

export default Charges;
