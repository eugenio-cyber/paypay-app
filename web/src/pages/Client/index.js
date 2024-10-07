import { Container } from "@mui/system";
import { useContext, useEffect } from "react";
import ArrowDown from "../../assets/arrow-down.svg";
import ArrowUp from "../../assets/arrow-up.svg";
import Avatar from "../../assets/avatar.svg";
import checkedIcon from "../../assets/checked-2.svg";
import closeIcon from "../../assets/close-2.svg";
import closeIconRed from "../../assets/close-3.svg";
import errorSymbol from "../../assets/ex-symbol.svg";
import IconEdit from "../../assets/icon-edit.svg";
import Leave from "../../assets/logout.svg";
import ClientBreadcrumbs from "../../components/Breadcrumb";
import CardClientInfo from "../../components/CardClientInfo";
import ModalCharge from "../../components/ModalCharge";
import ModalClient from "../../components/ModalClient";
import ModalEditUser from "../../components/ModalEditUser";
import UserContext from "../../context/userContext";
import { clear } from "../../utils/storage";
import "./styles.css";

export default function Client() {
  const {
    showOption,
    setShowOption,
    showModal,
    setShowModal,
    navigate,
    showPopupEdit,
    setShowPopupEdit,
    useLocalStorage,
    getItem,
    getUser,
    currentClient,
    showPopupCharge,
    setShowPopupCharge,
    setShowPopupDel,
    showPopupDel,
    warning,
  } = useContext(UserContext);

  const [client] = useLocalStorage("client", currentClient);

  const handleClickEditUser = () => {
    const localShowModal = { ...showModal };
    localShowModal.editUser = true;
    setShowModal({ ...localShowModal });
    setShowOption(false);
  };

  const handleExit = () => {
    clear();
    setShowOption(false);
    navigate("/");
  };

  useEffect(() => {}, [client]);

  return (
    <div className='clients'>
      <header className='header'>
        <ClientBreadcrumbs className='header-line' />
        <div className='header__user'>
          <img className='header__avatar' src={Avatar} alt='Avatar' />
          <span className='header__username'>{getItem("nome")}</span>
          <img
            className='cursor-pointer'
            src={ArrowDown}
            alt='Seta pra baixo'
            onClick={() => setShowOption(!showOption)}
          />

          {showOption && (
            <div className='options'>
              <div className='options__group'>
                <img
                  src={IconEdit}
                  alt='Caneta'
                  className='cursor-pointer'
                  onClick={() => handleClickEditUser()}
                />
                <img
                  className='options__arrow-up'
                  src={ArrowUp}
                  alt='Seta pra cima'
                />
              </div>
              <div className='options__group'>
                <img src={Leave} alt='Sair' onClick={() => handleExit()} />
              </div>
            </div>
          )}
        </div>
      </header>
      <section className='client__section'>
        <Container maxWidth='lg'>
          <CardClientInfo />
        </Container>
      </section>
      {showModal.addClient && <ModalClient editClient={true} />}
      {showModal.addCharge && <ModalCharge iconEdit={false} />}
      {showModal.editUser && <ModalEditUser getUser={getUser} />}

      {showPopupCharge.successful && (
        <div className='successful-register'>
          <img alt='Ícone de checado' src={checkedIcon} />
          <span>{warning.message}</span>
          <img
            alt='Botão fechar'
            src={closeIcon}
            className='cursor-pointer'
            onClick={() => setShowPopupCharge(false)}
          />
        </div>
      )}

      {showPopupEdit && (
        <div className='successful-register' style={{ width: 430 }}>
          <img alt='Ícone de checado' src={checkedIcon} />
          <span>Edições do cadastro concluídas com sucesso</span>
          <img
            alt='Botão fechar'
            src={closeIcon}
            className='cursor-pointer'
            onClick={() => setShowPopupEdit(false)}
          />
        </div>
      )}

      {(showPopupDel.successful || showPopupDel.failed) && (
        <div
          className={
            showPopupDel.successful ? "successful-register" : "failed-register"
          }
        >
          <img
            alt='Ícone da situação'
            src={showPopupDel.successful ? checkedIcon : errorSymbol}
          />
          <span>
            {showPopupDel.successful
              ? "Cobrança excluída com sucesso!"
              : "Esta cobrança não pode ser excluída!"}
          </span>
          <img
            alt='Botão fechar'
            src={showPopupDel.successful ? closeIcon : closeIconRed}
            className='cursor-pointer'
            onClick={() =>
              setShowPopupDel({
                successful: false,
                failed: false,
              })
            }
          />
        </div>
      )}
    </div>
  );
}
