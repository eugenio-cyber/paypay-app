import { TextField } from "@mui/material";
import { useState } from "react";
import crossedEye from "../../assets/crossedEye.svg";
import openedEye from "../../assets/open-eye.svg";
import "./styles.css";

import { useContext } from "react";
import UserContext from "../../context/userContext";

const Input = ({
  label,
  alert,
  width,
  type,
  id,
  placeholder,
  eyeIcon,
  inputName,
  isRequired,
  defaultValue,
  errorInput,
}) => {
  const { forms, setForms, handleCep } = useContext(UserContext);
  const [eyeState, setEyeState] = useState(false);

  async function changeInputValue(event) {
    const targetName = event.target.name;
    const targetValue = event.target.value;
    setForms((prev) => ({ ...prev, [targetName]: targetValue }));

    if (targetName === "cep" && targetValue.length === 8) {
      handleCep(targetValue);
    }
  }

  return (
    <div className='input' style={{ width: width }}>
      {eyeIcon && (
        <>
          {eyeState ? (
            <img
              alt='Ícone de senha'
              src={openedEye}
              className='eye-icon'
              onClick={() => setEyeState(false)}
            />
          ) : (
            <img
              alt='ícone de senha'
              src={crossedEye}
              className='eye-icon'
              onClick={() => setEyeState(true)}
            />
          )}
        </>
      )}

      <div className='input__top'>
        <label className='input__label' htmlFor={id}>
          {label}
        </label>
        <span className='forget-password cursor-pointer'>{alert}</span>
      </div>
      <TextField
        required={isRequired ? true : false}
        className='input-field'
        id={id}
        variant='outlined'
        placeholder={placeholder}
        type={eyeState ? "text" : type}
        name={inputName}
        value={forms.inputName}
        error={errorInput}
        defaultValue={defaultValue}
        onChange={(event) => changeInputValue(event)}
      />
    </div>
  );
};

export default Input;
