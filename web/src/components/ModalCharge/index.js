import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

import BasicButtons from "../Button";
import CancelButton from "../CancelButton";
import InputCharge from "../InputCharge";

import Charge from "../../assets/charges.svg";
import CheckboxChecked from "../../assets/checkbox-checked.png";
import Checkbox from "../../assets/checkbox.png";
import Close from "../../assets/close.svg";

import UserContext from "../../context/userContext";
import api from "../../services/api";
import { getItem } from "../../utils/storage";

import "./styles.css";

import { alert } from "../../global";
import { box, boxInput, modal, title } from "./styles.js";

const ModalCharge = () => {
  const {
    warning,
    setWarning,
    showModal,
    setShowModal,
    formCharge,
    handleLoadChargesClient,
    setFormCharge,
    setShowPopupCharge,
    getCharges,
  } = useContext(UserContext);

  const handleCloseModal = () => {
    const localShowModal = { ...showModal };
    const localFormCharge = { ...formCharge };

    localFormCharge.pay = "Pendente";
    localShowModal.addCharge = false;
    localShowModal.editCharge = false;

    setFormCharge({ ...localFormCharge });
    setShowModal({ ...localShowModal });
  };

  const handleSubmit = async (e) => {
    const localWarning = { ...warning };
    e.preventDefault();

    if (
      !formCharge.description.trim(" ") ||
      formCharge.description.length === 0 ||
      !formCharge.dueDate ||
      !formCharge.name ||
      !formCharge.value
    ) {
      localWarning.active = true;
      localWarning.message = "Todos os campos são obrigatórios";

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";

        setWarning({ ...localWarning });
      }, 2000);

      return;
    }
    if (showModal.addCharge) {
      try {
        await api.post(
          "/charges",
          {
            client_id: formCharge.clientId,
            descricao: formCharge.description,
            vencimento: formCharge.dueDate,
            valor: formCharge.value,
            status: formCharge.pay,
          },
          {
            headers: {
              Authorization: "Bearer " + getItem("token"),
            },
          }
        );

        getCharges();
        handleLoadChargesClient();
        handleCloseModal();

        setTimeout(() => {
          setShowPopupCharge({
            successful: true,
          });
        }, 1000);

        setTimeout(() => {
          setShowPopupCharge({
            successful: false,
          });
        }, 10000);

        const localWarning = { ...warning };
        localWarning.message = "Cobrança cadastrada com sucesso";
        setWarning({ ...localWarning });
      } catch (error) {
        const localWarning = { ...warning };
        localWarning.active = true;
        localWarning.message = error.response.data;

        setWarning({ ...localWarning });

        setTimeout(() => {
          localWarning.active = false;
          localWarning.message = "";
          setWarning({ ...localWarning });
        }, 4000);
      }
    }

    if (showModal.editCharge) {
      const data = {};

      if (formCharge.formCharge.description) {
        data.descricao = formCharge.description;
      }

      if (formCharge.value) {
        data.valor = formCharge.value;
      }

      if (formCharge.dueDate) {
        data.vencimento = formCharge.dueDate;
      }

      if (formCharge.pay) {
        data.status = formCharge.pay;
      }

      try {
        await api.patch(`/charges/${formCharge.chargeId}`, data, {
          headers: {
            Authorization: "Bearer " + getItem("token"),
          },
        });

        getCharges();
        handleLoadChargesClient();
        handleCloseModal();

        setTimeout(() => {
          setShowPopupCharge({
            successful: true,
          });
        }, 1000);

        setTimeout(() => {
          setShowPopupCharge({
            successful: false,
          });
        }, 10000);

        const localWarning = { ...warning };
        localWarning.message = "Cobrança editada com sucesso";
        setWarning({ ...localWarning });
      } catch (error) {
        const localWarning = { ...warning };
        localWarning.active = true;
        localWarning.message = error.response.data;

        setWarning({ ...localWarning });

        setTimeout(() => {
          localWarning.active = false;
          localWarning.message = "";
          setWarning({ ...localWarning });
        }, 4000);
      }
    }
  };

  const editPay = (status) => {
    const localFormCharge = { ...formCharge };
    localFormCharge.pay = status;
    setFormCharge({ ...localFormCharge });
  };
  return (
    <>
      <Modal
        open={showModal.addCharge || showModal.editCharge}
        onClose={() => handleCloseModal()}
        sx={modal}
      >
        <Box sx={box}>
          <div className='title-charge'>
            <img alt='Ícone da cobrança' src={Charge} />

            <Typography id='modal-modal-title' variant='h1' style={title}>
              {showModal.addCharge
                ? "Cadastro de Cobrança"
                : "Edição de Cobrança"}
            </Typography>
          </div>
          <img
            className='modal__close cursor-pointer'
            src={Close}
            alt='Botão fechar'
            onClick={() => handleCloseModal()}
          />
          <form className='form' onSubmit={handleSubmit}>
            <InputCharge
              label='Nome*'
              width='485px'
              type='text'
              id='name'
              name='name'
              isDisabled={true}
              defaultValue={formCharge.name}
            />
            <InputCharge
              description={true}
              label='Descrição*'
              width='485px'
              height='88px'
              type='text'
              id='description'
              placeholder='Digite a descrição'
              name='description'
              isRequired={showModal.addCharge ? true : false}
            />
            <Box component='div' style={boxInput}>
              <InputCharge
                label='Vencimento*'
                width='232px'
                type='date'
                id='dueDate'
                placeholder='Data de Vencimento'
                name='dueDate'
                isRequired={showModal.addCharge ? true : false}
              />
              <InputCharge
                label='Valor*'
                width='232px'
                type='number'
                id='value'
                placeholder='Digite o valor'
                name='value'
                isRequired={showModal.addCharge ? true : false}
              />
            </Box>
            <div className='checkbox'>
              <label className='checkbox__label'>Status</label>

              <div className='checkbox__item'>
                {formCharge.pay === "Paga" ? (
                  <img
                    className='cursor-pointer'
                    src={CheckboxChecked}
                    alt='Checkbox'
                    onClick={() => editPay("Pendente")}
                  />
                ) : (
                  <img
                    className='cursor-pointer'
                    src={Checkbox}
                    alt='Checkbox'
                    onClick={() => editPay("Paga")}
                  />
                )}
                <span>Cobrança Paga</span>
              </div>

              <div className='checkbox__item'>
                {formCharge.pay === "Pendente" ? (
                  <img
                    className='cursor-pointer'
                    src={CheckboxChecked}
                    alt='Checkbox'
                    onClick={() => editPay("Paga")}
                  />
                ) : (
                  <img
                    className='cursor-pointer'
                    src={Checkbox}
                    alt='Checkbox'
                    onClick={() => editPay("Pendente")}
                  />
                )}

                <span>Cobrança Pendente</span>
              </div>
            </div>
            <Box component='div' style={boxInput}>
              <CancelButton onClick={handleCloseModal} />
              <BasicButtons
                variant='contained'
                action='Aplicar'
                width='200px'
              />
            </Box>
          </form>
        </Box>
      </Modal>

      {warning.active && (
        <Alert variant='filled' severity={warning.type} sx={alert}>
          {warning.message}
        </Alert>
      )}
    </>
  );
};

export default ModalCharge;
