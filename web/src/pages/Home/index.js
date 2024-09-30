import { useContext, useEffect } from "react";

import "./styles.css";

import AnticipatedCharges from "../../assets/anticipated-charges.svg";
import ArrowDown from "../../assets/arrow-down.svg";
import ArrowUp from "../../assets/arrow-up.svg";
import Avatar from "../../assets/avatar.svg";
import DefaulterClients from "../../assets/defaulter-clients.svg";
import FreeCustomers from "../../assets/free-customers.svg";
import Leave from "../../assets/leave.svg";
import OverdueCharges from "../../assets/overdue-charges.svg";
import PaidCharges from "../../assets/paid-charges.svg";
import Pencil from "../../assets/pencil.svg";
import CardCharges from "../../components/CardCharges";
import CardClients from "../../components/CardClients";
import DialogWait from "../../components/Dialog";
import ModalEditUser from "../../components/ModalEditUser";
import UserContext from "../../context/userContext";
import api from "../../services/api";
import { removeItem } from "../../utils/storage";

function toCurrency(value) {
  return (Number(value) / 100).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    } || "0,00"
  );
}

function toPanel(value) {
  return Number(value) < 10 ? `0${value}` : value;
}

const Home = () => {
  const {
    navigate,
    showModal,
    setShowModal,
    showOption,
    setShowOption,
    currentUser,
    setPanel,
    panel,
    getItem,
    getUser,
  } = useContext(UserContext);

  const handleLoadChargesPanel = async () => {
    try {
      const localCharges = await api.get("/panel/charges", {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
        },
      });

      const localClients = await api.get("/panel/clients", {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
        },
      });

      const { paid, pending, overdue } = localCharges.data;
      const { legals, defaulting } = localClients.data;

      setPanel({
        ...panel,
        paid,
        pending,
        overdue,
        legals,
        defaulting,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleExit = () => {
    setShowOption(false);
    removeItem("token");
    removeItem("nome");
    navigate("/");
    return;
  };

  const handleClickEditUser = () => {
    const localShowModal = { ...showModal };
    localShowModal.editUser = true;
    setShowModal({ ...localShowModal });
    setShowOption(false);
    return;
  };

  useEffect(() => {
    getUser();
    handleLoadChargesPanel();
  }, []);

  useEffect(() => {}, [panel, setPanel]);

  return (
    <div className='home'>
      <header className='header'>
        <h1 className='home-header__title'>Resumo das cobranças</h1>
        <div className='header__user'>
          <img className='header__avatar' src={Avatar} alt='Avatar' />
          <span className='header__username'>{currentUser.name}</span>
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
      <main className='home-main'>
        <section className='home-main__charges'>
          <CardCharges
            img={PaidCharges}
            title='Cobranças Pagas'
            subtitle={toCurrency(panel.paid.total)}
            topic='Cobranças Vencidas'
            number={toPanel(panel.overdue.number)}
            background='#eef7f7'
            colorNumber='#971d1d'
            backgroundNumber='#ffefef'
            list={panel.overdue.list}
            toCurrency={toCurrency}
            status='Vencida'
          />
          <CardCharges
            img={OverdueCharges}
            title='Cobranças Vencidas'
            subtitle={toCurrency(panel.overdue.total)}
            topic='Cobranças Previstas'
            number={toPanel(panel.pending.number)}
            background='#ffefef'
            colorNumber='#c5a605'
            backgroundNumber='#fcf6dc'
            list={panel.pending.list}
            toCurrency={toCurrency}
            status='Pendente'
          />
          <CardCharges
            img={AnticipatedCharges}
            title='Cobranças Previstas'
            subtitle={toCurrency(panel.pending.total)}
            topic='Cobranças Pagas'
            number={toPanel(panel.paid.number)}
            background='#fcf6dc'
            colorNumber='#1fa7af'
            backgroundNumber='#eef6f6'
            list={panel.paid.list}
            toCurrency={toCurrency}
            status='Paga'
          />
        </section>
        <section className='home-main__clients'>
          <CardClients
            img={DefaulterClients}
            title='Clientes Inadimplentes'
            number={toPanel(panel.defaulting.number)}
            colorNumber='#971d1d'
            backgroundNumber='#ffefef'
            rows={panel.defaulting.list}
            toCurrency={toCurrency}
            status={false}
          />
          <CardClients
            img={FreeCustomers}
            title='Clientes em dia'
            number={toPanel(panel.legals.number)}
            colorNumber='#1FA7AF'
            backgroundNumber='#EEF6F6'
            rows={panel.legals.list}
            toCurrency={toCurrency}
            status={true}
          />
        </section>
      </main>
      <DialogWait time={1200} />
      {showModal.editUser && <ModalEditUser getUser={getUser} />}
    </div>
  );
};

export default Home;
