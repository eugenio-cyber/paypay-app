import { Button } from "@mui/material";
import "./styles.css";

export default function BasicButtons({
  startIcon,
  variant,
  action,
  width,
  marginTop,
}) {
  return (
    <Button
      type='submit'
      variant={variant}
      sx={{ width: width, marginTop: marginTop }}
      className='button--purple'
      startIcon={startIcon && startIcon}
    >
      {action}
    </Button>
  );
}
