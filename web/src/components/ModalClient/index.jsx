import "./styles.css";

import clientsIcon from "../../assets/clients2.svg";
import closeIcon from "../../assets/close.svg";

import { useContext, useEffect, useState } from "react";
import Input from "../Input";
import UserContext from "../../context/userContext";
import { alert } from "../../global";
import api from "../../services/api";
import BasicButtons from "../Button";

export default function ModalClient({ showClients, editClient }) {
  const {
    Alert,
    forms,
    getItem,
    setForms,
    setShowModal,
    setShowPopup,
    setShowPopupEdit,
    setWarning,
    viaCep,
    warning,
    cliente,
    setCliente,
  } = useContext(UserContext);

  const [errorInput, setErrorInput] = useState(false);

  function handleClose() {
    setForms({
      name: "",
      email: "",
      password: "",
      repeatedPassword: "",
      cpf: "",
      phone: "",
      address: "",
      complement: "",
      cep: "",
      neighborhood: "",
      city: "",
      uf: "",
    });

    setShowModal(false);
  }

  async function handleAddClient(evt) {
    evt.preventDefault();
    const localWarning = { ...warning };

    if (
      !forms.name.trim() ||
      !forms.email.trim() ||
      !forms.cpf.trim() ||
      !forms.phone.trim()
    ) {
      setErrorInput(true);

      localWarning.active = true;
      localWarning.message =
        "Os campos com (*) não podem possuir espaços em branco";

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";

        setWarning({ ...localWarning });
      }, 4000);

      return;
    }

    if (forms.cpf.length < 11) {
      localWarning.active = true;
      localWarning.message =
        "O CPF deve ter no mínimo 11 dígitos e no máximo 14.";

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";

        setWarning({ ...localWarning });
      }, 4000);

      return;
    }

    try {
      await api.post(
        "/clients",
        {
          nome: forms.name,
          email: forms.email,
          cpf: forms.cpf,
          telefone: forms.phone,
          logradouro: forms.address,
          complemento: forms.complement,
          cep: forms.cep,
          bairro: forms.neighborhood,
          cidade: forms.city,
          estado: forms.uf,
        },
        {
          headers: {
            Authorization: "Bearer " + getItem("token"),
          },
        }
      );

      setShowModal(false);

      await showClients();

      setTimeout(() => {
        setShowPopup(true);
      }, 1000);

      setTimeout(() => {
        setShowPopup(false);
      }, 10000);
    } catch (error) {
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

  async function handleEditClient(e) {
    e.preventDefault();

    const localWarning = { ...warning };

    if (
      !forms.name.trim() ||
      !forms.email.trim() ||
      !forms.cpf.trim() ||
      !forms.phone.trim()
    ) {
      setErrorInput(true);

      localWarning.active = true;
      localWarning.message =
        "Os campos com (*) não podem possuir espaços em branco";

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";

        setWarning({ ...localWarning });
      }, 4000);

      return;
    }

    if (forms.cpf.length < 11) {
      localWarning.active = true;
      localWarning.message =
        "O CPF deve ter no mínimo 11 dígitos e no máximo 14.";

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";

        setWarning({ ...localWarning });
      }, 4000);

      return;
    }

    const clientInfos = {
      name: forms.name !== cliente.name ? forms.name : cliente.name,
      email: forms.email !== cliente.email ? forms.email : cliente.email,
      cpf: forms.cpf !== cliente.cpf ? forms.cpf : cliente.cpf,
      phone: forms.phone !== cliente.phone ? forms.phone : cliente.phone,
      address:
        forms.address !== cliente.address ? forms.address : cliente.address,
      complement:
        forms.complement !== cliente.complement
          ? forms.complement
          : cliente.complement,
      cep: forms.cep !== cliente.cep ? forms.cep : cliente.cep,
      street: forms.street !== cliente.street ? forms.street : cliente.street,
      city: forms.city !== cliente.city ? forms.city : cliente.city,
      state: forms.state !== cliente.state ? forms.state : cliente.state,
    };

    try {
      await api.patch(`/clients/${cliente.id}`, clientInfos, {
        headers: {
          Authorization: "Bearer " + getItem("token"),
        },
      });

      setCliente({ ...clientInfos, id: cliente.id });
      setShowModal(false);

      setTimeout(() => {
        setShowPopupEdit(true);
      }, 1000);

      setTimeout(() => {
        setShowPopupEdit(false);
      }, 10000);
    } catch (error) {
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

  useEffect(() => {
    if (viaCep.cep.length === 8) {
      setForms({
        ...forms,
        cep: viaCep.cep,
        address: viaCep.logradouro,
        complement: viaCep.complemento,
        street: viaCep.bairro,
        city: viaCep.localidade,
        state: viaCep.uf,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viaCep]);

  useEffect(() => {
    if (editClient) {
      setForms({
        name: cliente.name,
        email: cliente.email,
        cpf: cliente.cpf,
        phone: cliente.phone,
        street: cliente.street,
        complement: cliente.complement,
        cep: cliente.cep,
        address: cliente.address,
        city: cliente.city,
        state: cliente.state,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container-modal'>
      <div className='add-card'>
        <img
          alt='Botão fechar'
          src={closeIcon}
          className='close-icon'
          onClick={() => handleClose()}
        />

        <div className='head-card'>
          <img alt='Ícone cliente' src={clientsIcon} />
          <h1>{!editClient ? "Cadastro do Cliente" : "Editar Cliente"} </h1>
        </div>

        <form
          className='form-modal'
          onSubmit={!editClient ? handleAddClient : handleEditClient}
        >
          <Input
            label='Nome*'
            width={460}
            type='text'
            id='nome'
            placeholder='Digite o nome'
            inputName='name'
            errorInput={forms.name ? false : errorInput}
            defaultValue={!editClient ? "" : cliente.name}
          />

          <Input
            label='E-mail*'
            width={460}
            type='email'
            id='email'
            placeholder='Digite seu e-mail'
            inputName='email'
            errorInput={forms.email ? false : errorInput}
            defaultValue={!editClient ? "" : cliente.email}
          />

          <div className='inputs-numbers'>
            <Input
              label='CPF*'
              width={210}
              type='text'
              id='cpf'
              placeholder='Digite o CPF'
              inputName='cpf'
              errorInput={forms.cpf ? false : errorInput}
              defaultValue={!editClient ? "" : cliente.cpf}
            />

            <Input
              label='Telefone*'
              width={210}
              type='text'
              id='phone'
              placeholder='Digite o telefone'
              inputName='phone'
              errorInput={forms.phone ? false : errorInput}
              defaultValue={!editClient ? "" : cliente.phone}
            />
          </div>

          <Input
            label='Endereço'
            width={460}
            type='text'
            id='address'
            placeholder='Digite o endereço'
            inputName='address'
            defaultValue={!editClient ? "" : cliente.address}
          />

          <Input
            label='Complemento'
            width={460}
            type='text'
            id='complement'
            placeholder='Digite o complemento'
            inputName='complement'
            defaultValue={!editClient ? "" : cliente.complement}
          />

          <div className='inputs-numbers'>
            <Input
              label='CEP'
              width={210}
              type='text'
              id='cep'
              placeholder='Digite o CEP'
              inputName='cep'
              defaultValue={!editClient ? "" : cliente.cep}
            />

            <Input
              label='Bairro'
              width={210}
              type='text'
              id='neighborhood'
              placeholder='Digite o bairro'
              inputName='neighborhood'
              defaultValue={!editClient ? "" : cliente.street}
            />
          </div>

          <div className='inputs-numbers'>
            <Input
              label='Cidade'
              width={210}
              type='text'
              id='city'
              placeholder='Digite a cidade'
              inputName='city'
              defaultValue={!editClient ? "" : cliente.city}
            />

            <Input
              label='UF'
              width={210}
              type='text'
              id='uf'
              placeholder='Digite a UF'
              inputName='uf'
              defaultValue={!editClient ? "" : cliente.state}
            />
          </div>

          <div className='btn-area'>
            <button
              type='button'
              className='btn-cancel'
              onClick={() => handleClose()}
            >
              Cancelar
            </button>

            <BasicButtons variant='contained' action='Aplicar' width={220} />
          </div>
        </form>
      </div>
      {warning.active && (
        <Alert variant='filled' severity={warning.type} sx={alert}>
          {warning.message}
        </Alert>
      )}
    </div>
  );
}
