import "./styles.css";

import { TextField, Box } from "@mui/material";
import clientsIcon from "../../assets/clients2.svg";
import closeIcon from "../../assets/close.svg";

import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import UserContext from "../../context/userContext";
import api from "../../services/api";
import BasicButtons from "../Button";
import { cpfMask, phoneMask, cepMask } from "../../utils/functions";

export default function ModalClient({ editClient }) {
  const {
    getItem,
    setShowModal,
    client,
    setClient,
    showClients,
    setWarning,
    warning,
  } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const watchCep = watch("cep");

  const handleCep = async () => {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${watchCep}/json/`
      );
      const { cep, logradouro, complemento, bairro, localidade, estado } =
        await response.json();

      reset({
        cep: cep.replace("-", ""),
        street: logradouro,
        complement: complemento,
        address: bairro,
        city: localidade,
        state: estado,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  function handleClose() {
    setShowModal(false);
  }

  const handleAddClient = async (data) => {
    try {
      await api.post("/clients", data, {
        headers: {
          Authorization: "Bearer " + getItem("token"),
        },
      });

      setShowModal(false);
      await showClients();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClient = async (data) => {
    try {
      await api.patch(
        "/clients",
        {
          ...data,
          cpf: data.cpf.replace(/\D/g, ""),
          phone: data.phone.replace(/\D/g, ""),
          cep: data.cep.replace(/\D/g, ""),
          oldEmail: client.email,
        },
        {
          headers: {
            Authorization: "Bearer " + getItem("token"),
          },
        }
      );

      setClient({ ...data, id: client.id });
      setShowModal(false);
    } catch (error) {
      setWarning({ ...warning, active: true, message: error.response.data });

      setTimeout(() => {
        setWarning({ ...warning, active: false, message: "" });
      }, 4000);
    }
  };

  useEffect(() => {
    if (watchCep?.length === 8) handleCep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCep]);

  useEffect(() => {
    if (editClient)
      reset({
        ...client,
        cpf: cpfMask(`${client.cpf}`),
        phone: phoneMask(`${client.phone}`),
        cep: cepMask(`${client.cep}`),
      });
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
          <img alt='Ícone client' src={clientsIcon} />
          <h1>{editClient ? "Editar Cliente" : "Cadastro do Cliente"} </h1>
        </div>

        <form
          className='form-modal'
          onSubmit={handleSubmit(
            editClient ? handleEditClient : handleAddClient
          )}
        >
          <TextField
            label='Nome*'
            type='text'
            variant='outlined'
            style={{ marginBottom: "14px" }}
            error={!!errors?.name}
            InputLabelProps={{ shrink: true }}
            {...register("name", { required: true })}
            helperText={
              errors?.name?.type === "required" && "Nome é obrigatório"
            }
          />
          <TextField
            label='E-mail*'
            type='email'
            variant='outlined'
            style={{ marginBottom: "14px" }}
            error={!!errors?.email}
            InputLabelProps={{ shrink: true }}
            {...register("email", { required: true })}
            helperText={
              errors?.email?.type === "required" && "E-mail é obrigatório"
            }
          />

          <Box className='inputs-numbers'>
            <TextField
              fullWidth
              label='CPF*'
              type='text'
              variant='outlined'
              style={{ marginBottom: "14px" }}
              error={!!errors?.cpf}
              InputLabelProps={{ shrink: true }}
              {...register("cpf", { required: true, minLength: 11 })}
              onChange={(e) => {
                setValue("cpf", cpfMask(e.target.value));
              }}
              helperText={() => {
                if (errors?.cpf?.type === "required")
                  return "CPF é obrigatório";
                if (errors?.cpf?.type === "minLength") return "CPF inválido";
              }}
            />
            <TextField
              fullWidth
              label='Telefone*'
              type='text'
              variant='outlined'
              style={{ marginBottom: "14px" }}
              error={!!errors?.phone}
              InputLabelProps={{ shrink: true }}
              {...register("phone", { required: true })}
              onChange={(e) => {
                setValue("phone", phoneMask(e.target.value));
              }}
              helperText={
                errors?.phone?.type === "required" && "Telefone é obrigatório"
              }
            />
          </Box>

          <TextField
            label='Endereço'
            type='text'
            variant='outlined'
            style={{ marginBottom: "14px" }}
            InputLabelProps={{ shrink: true }}
            {...register("address")}
          />
          <TextField
            label='Complemento'
            type='text'
            variant='outlined'
            style={{ marginBottom: "14px" }}
            InputLabelProps={{ shrink: true }}
            {...register("complement")}
          />

          <Box className='inputs-numbers'>
            <TextField
              fullWidth
              label='Cep'
              type='text'
              variant='outlined'
              style={{ marginBottom: "14px" }}
              error={!!errors?.cep}
              InputLabelProps={{ shrink: true }}
              {...register("cep", { minLength: 9 })}
              onChange={(e) => {
                setValue("cep", cepMask(e.target.value));
              }}
              helperText={errors?.cep?.type === "minLength" && "Cep inválido"}
            />
            <TextField
              fullWidth
              label='Bairro'
              type='text'
              variant='outlined'
              style={{ marginBottom: "14px" }}
              InputLabelProps={{ shrink: true }}
              {...register("street")}
            />
          </Box>

          <Box className='inputs-numbers'>
            <TextField
              fullWidth
              label='Cidade'
              type='text'
              variant='outlined'
              style={{ marginBottom: "14px" }}
              InputLabelProps={{ shrink: true }}
              {...register("city")}
            />
            <TextField
              fullWidth
              label='Estado'
              type='text'
              variant='outlined'
              style={{ marginBottom: "14px" }}
              InputLabelProps={{ shrink: true }}
              {...register("state")}
            />
          </Box>

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
    </div>
  );
}
