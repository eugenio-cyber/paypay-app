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

  async function changeInputValue(evt) {
    const oldValue = evt.target.name;
    const newValue = evt.target.value;
    setForms({ ...forms, [oldValue]: newValue });

    if (oldValue === "cep") {
      if (newValue.length === 8) {
        handleCep(newValue);
      }
    }
  }

  return (
    <div className="input" style={{ width: width }}>
      {eyeIcon && (
        <>
          {eyeState ? (
            <img
              alt="Ícone de senha"
              src={openedEye}
              className="eyeIcon"
              onClick={() => setEyeState(false)}
            />
          ) : (
            <img
              alt="ícone de senha"
              src={crossedEye}
              className="eyeIcon"
              onClick={() => setEyeState(true)}
            />
          )}
        </>
      )}

      <div className="input__top">
        <label className="input__label" htmlFor={id}>
          {label}
        </label>
        <span className="forget-password cursor-pointer">{alert}</span>
      </div>
      <TextField
        required={isRequired === undefined ? false : true}
        className="input-field"
        id={id}
        variant="outlined"
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
