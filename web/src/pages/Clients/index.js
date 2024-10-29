import "./styles.css";

import ArrowDown from "../../assets/arrow-down.svg";
import ArrowUp from "../../assets/arrow-up.svg";
import Avatar from "../../assets/avatar.svg";
import BillingAccepted from "../../assets/billing-accepted.png";
import checkedIcon from "../../assets/checked-2.svg";
import clientsIcon from "../../assets/clients2.svg";
import closeIcon from "../../assets/close-2.svg";
import Close from "../../assets/close.svg";
import frames from "../../assets/frames.svg";
import Leave from "../../assets/leave.svg";
import Pencil from "../../assets/pencil.svg";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import BasicButtons from "../../components/Button";
import ClientsTable from "../../components/ClientsTable";
import DialogWait from "../../components/Dialog";
import ModalCharge from "../../components/ModalCharge";
import ModalClient from "../../components/ModalClient";
import ModalEditUser from "../../components/ModalEditUser";
import UserContext from "../../context/userContext";
import { clear, getItem } from "../../utils/storage";

const Clients = () => {
  const {
    showOption,
    setShowOption,
    showModal,
    setShowModal,
    navigate,
    showPopup,
    setShowPopup,
    warning,
    setWarning,
    showPopupCharge,
    setShowPopupCharge,
    showClients,
    clientsList,
    setClientsList,
    order,
    setOrder,
    user,
  } = useContext(UserContext);

  function orderClients() {
    setOrder(!order);
    const localClientsList = clientsList;

    if (order) {
      localClientsList.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else {
      localClientsList.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
    setClientsList(localClientsList);
    return;
  }

  const [query, setQuery] = useState("");

  const handleExit = () => {
    clear();
    setShowOption(false);
    navigate("/");
  };

  const handleClickAddClient = () => {
    const localShowModal = { ...showModal };
    localShowModal.addClient = true;
    setShowModal({ ...localShowModal });
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

    setWarning({ ...localWarning });
  };

  useEffect(() => {
    showClients();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='clients'>
      <header className='header'>
        <span className='header-line'>Clientes</span>
        <div className='header__user'>
          <img className='header__avatar' src={Avatar} alt='Avatar' />
          <span className='header__username'>{user.name}</span>
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
                <img src={Pencil} alt='Caneta' className='cursor-pointer' />
                <span className='options__text'>Editar</span>
                <img
                  className='options__arrow-up'
                  src={ArrowUp}
                  alt='Seta pra cima'
                />
              </div>
              <div className='options__group'>
                <img src={Leave} alt='Sair' onClick={() => handleExit()} />
                <span className='options__text'>Sair</span>
              </div>
            </div>
          )}
        </div>
      </header>
      <section className='section-clients'>
        <div className='clients__section'>
          <div className='clients-headline'>
            <img alt='Ícone cliente' src={clientsIcon} />
            <h1 className='dashboard-title'>Clientes</h1>
          </div>
          <div className='action__section'>
            <div onClick={() => handleClickAddClient()}>
              <BasicButtons
                variant='contained'
                action='Adicionar cliente'
                width='266px'
                startIcon={<AddIcon color='white' />}
              />
            </div>
            <img alt='frames' src={frames} />
            <div className='input__section'>
              <InputBase
                type='text'
                placeholder='Pesquisa'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                endAdornment={<SearchIcon />}
                className='input-clients__section'
              />
            </div>
          </div>
        </div>
        <div className='info-clients'>
          <ClientsTable orderClients={orderClients} query={query} />
        </div>
      </section>

      {showModal.addClient && (
        <ModalClient showClients={showClients} editClient={false} />
      )}

      {showPopup && (
        <div className='successful-register'>
          <img alt='Ícone de checado' src={checkedIcon} />
          <span>Cadastro concluído com sucesso</span>
          <img
            alt='Botão fechar'
            src={closeIcon}
            className='cursor-pointer'
            onClick={() => setShowPopup(false)}
          />
        </div>
      )}

      {showPopupCharge.successful && (
        <div className='successful-register'>
          <img alt='Ícone de checado' src={checkedIcon} />
          <span>Cobrança cadastrada com sucesso</span>
          <img
            alt='Botão fechar'
            src={closeIcon}
            className='cursor-pointer'
            onClick={() => setShowPopupCharge(false)}
          />
        </div>
      )}

      {showModal.addCharge && <ModalCharge iconEdit={false} />}

      {showModal.editUser && <ModalEditUser />}
      {warning.active && warning.type !== "error" && (
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
    </div>
  );
};

export default Clients;
