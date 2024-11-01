import "./styles.css";

import { Alert, Modal, Typography, TextField, Box } from "@mui/material";
import { box, boxInput, boxSuccess, modal, title } from "./styles";
import Close from "../../assets/close.svg";
import Success from "../../assets/success.svg";
import crossedEye from "../../assets/crossedEye.svg";
import openedEye from "../../assets/open-eye.svg";

import userContext from "../../context/userContext";
import { useEffect, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { alert } from "../../global";
import BasicButtons from "../Button";
import { cpfMask, phoneMask } from "../../utils/functions";

import api from "../../services/api";

export default function ModalEditUser({ getUser }) {
  const {
    warning,
    setWarning,
    showModal,
    setShowModal,
    getItem,
    useLocalStorage,
  } = useContext(userContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const watchPassword = watch("password");
  const [user] = useLocalStorage("user");
  const [showSuccess, setShowSuccess] = useState(false);
  const [eyeState, setEyeState] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleCloseModal = () => {
    setShowModal({ ...showModal, editUser: false });
  };

  const onSubmit = async (data) => {
    if (!data.password) delete data.password;

    delete data.confirmPassword;

    try {
      await api.patch(
        "/users",
        {
          ...data,
          cpf: data.cpf.replace(/\D/g, ""),
          phone: data.phone.replace(/\D/g, ""),
          oldEmail: user.email,
        },
        {
          headers: {
            Authorization: "Bearer " + getItem("token"),
          },
        }
      );

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        handleCloseModal();
      }, 2000);

      await getUser();
    } catch (error) {
      setWarning({ ...warning, active: true, message: error.response.data });

      setTimeout(() => {
        setWarning({ ...warning, active: false, message: "" });
      }, 4000);
    }
  };

  useEffect(() => {
    if (user)
      reset({ ...user, cpf: cpfMask(user.cpf), phone: phoneMask(user.phone) });
  }, []);

  return (
    <>
      <Modal
        open={showModal.editUser}
        onClose={() => handleCloseModal()}
        sx={modal}
      >
        <Box sx={box}>
          {showSuccess && (
            <Box component='div' style={boxSuccess}>
              <img src={Success} alt='Imagem de sucesso' />
              <Typography id='modal-modal-title' variant='h1' style={title}>
                Cadastro Alterado com sucesso!
              </Typography>
            </Box>
          )}

          {!showSuccess && (
            <>
              <Typography id='modal-modal-title' variant='h1' style={title}>
                Edite seu cadastro
              </Typography>
              <img
                className='modal__close cursor-pointer'
                src={Close}
                alt='Botão fechar'
                onClick={() => handleCloseModal()}
              />
              <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
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

                <Box style={boxInput}>
                  <TextField
                    fullWidth
                    label='CPF*'
                    type='text'
                    variant='outlined'
                    style={{ marginBottom: "14px" }}
                    error={!!errors?.cpf}
                    InputLabelProps={{ shrink: true }}
                    {...register("cpf", { required: true, minLength: 14 })}
                    onChange={(e) => {
                      setValue("cpf", cpfMask(e.target.value));
                    }}
                    helperText={
                      errors?.cpf?.type === "required" && "CPF é obrigatório"
                    }
                  />
                  <TextField
                    fullWidth
                    label='Telefone*'
                    type='text'
                    variant='outlined'
                    style={{ marginBottom: "14px" }}
                    error={!!errors?.phone}
                    InputLabelProps={{ shrink: true }}
                    {...register("phone", { required: true, maxLength: 15 })}
                    onChange={(e) => {
                      setValue("phone", phoneMask(e.target.value));
                    }}
                    helperText={
                      errors?.phone?.type === "required" &&
                      "Telefone é obrigatório"
                    }
                  ></TextField>
                </Box>

                <Box className='input-box' style={boxInput}>
                  {eyeState.password ? (
                    <img
                      alt='Ícone de senha'
                      src={openedEye}
                      className='eye-icon'
                      onClick={() =>
                        setEyeState({
                          ...eyeState,
                          password: false,
                        })
                      }
                    />
                  ) : (
                    <img
                      alt='ícone de senha'
                      src={crossedEye}
                      className='eye-icon'
                      onClick={() =>
                        setEyeState({
                          ...eyeState,
                          password: true,
                        })
                      }
                    />
                  )}
                  <TextField
                    fullWidth
                    label='Nova Senha'
                    type={eyeState.password ? "text" : "password"}
                    variant='outlined'
                    style={{ marginBottom: "14px" }}
                    error={!!errors?.password}
                    InputLabelProps={{ shrink: true }}
                    {...register("password", { minLength: 6 })}
                    helperText={
                      errors?.password?.type === "minLength" &&
                      "Senha precisa ter no mínimo oito dígitos."
                    }
                  ></TextField>
                </Box>

                <Box className='input-box' style={boxInput}>
                  {eyeState.confirmPassword ? (
                    <img
                      alt='Ícone de senha'
                      src={openedEye}
                      className='eye-icon'
                      onClick={() =>
                        setEyeState({ ...eyeState, confirmPassword: false })
                      }
                    />
                  ) : (
                    <img
                      alt='ícone de senha'
                      src={crossedEye}
                      className='eye-icon'
                      onClick={() =>
                        setEyeState({ ...eyeState, confirmPassword: true })
                      }
                    />
                  )}
                  <TextField
                    fullWidth
                    label='Confirmar Senha'
                    type={eyeState.confirmPassword ? "text" : "password"}
                    variant='outlined'
                    style={{ marginBottom: "14px" }}
                    error={!!errors?.confirmPassword}
                    InputLabelProps={{ shrink: true }}
                    {...register("confirmPassword", {
                      validate: (value) => value === watchPassword,
                    })}
                    helperText={
                      errors?.confirmPassword?.type === "validate" &&
                      "Senhas não correspondem"
                    }
                  ></TextField>
                </Box>

                <BasicButtons
                  variant='contained'
                  action='Continuar'
                  width='160px'
                />
              </form>
            </>
          )}
        </Box>
      </Modal>

      {warning.active && (
        <Alert variant='filled' severity={warning.type} sx={alert}>
          {warning.message}
        </Alert>
      )}
    </>
  );
}
