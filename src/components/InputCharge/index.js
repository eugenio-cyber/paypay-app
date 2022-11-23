import "./styles.css";
import { TextField } from "@mui/material";

import UserContext from "../../context/userContext";
import { useContext } from "react";

const InputCharge = ({
  label,
  width,
  type,
  id,
  placeholder,
  name,
  isRequired,
  defaultValue,
  isDisabled,
  description,
}) => {
  const { formCharge, setFormCharge } = useContext(UserContext);

  function changeInputValue(evt) {
    const oldValue = evt.target.name;
    const newValue = evt.target.value;

    setFormCharge({ ...formCharge, [oldValue]: newValue });
  }

  return (
    <div className="input" style={{ width: width }}>
      <div className="input__top">
        <label className="input__label" htmlFor={id}>
          {label}
        </label>
      </div>
      {description && (
        <textarea
          className="input-charge__description"
          type={type}
          placeholder={placeholder}
          name={name}
          value={formCharge.inputName}
          style={{ width: width }}
          onChange={(event) => changeInputValue(event)}
        />
      )}
      {!description && (
        <TextField
          id={id}
          variant="outlined"
          disabled={isDisabled === undefined ? false : isDisabled}
          placeholder={placeholder}
          type={type}
          name={name}
          value={formCharge.inputName}
          defaultValue={defaultValue === undefined ? "" : defaultValue}
          required={isRequired === undefined && true}
          onChange={(event) => changeInputValue(event)}
        />
      )}
    </div>
  );
};

export default InputCharge;
