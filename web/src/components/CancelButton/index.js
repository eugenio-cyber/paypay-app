import { Button } from "@mui/material";
import { btnCancel } from "./styles";

const CancelButton = ({ onClick }) => {
  return (
    <Button type="submit" onClick={() => onClick()} sx={btnCancel}>
      Cancelar
    </Button>
  );
};

export default CancelButton;
