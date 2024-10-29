import { useContext, useEffect } from "react";
import BasicButtons from "../../components/Button";
import Input from "../../components/Input";
import UserContext from "../../context/userContext";
import { alert } from "../../global";
import api from "../../services/api";
import { getItem, setItem } from "../../utils/storage";
import "./styles.css";

const Login = () => {
  const {
    Link,
    Alert,
    forms,
    setForms,
    navigate,
    warning,
    setWarning,
    setUser,
  } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (forms.password.includes(" ") || forms.email.includes(" ")) {
      const localWarning = { ...warning };

      localWarning.active = true;
      localWarning.message =
        "Os campos email e senha não podem possuir espaços em branco";

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";

        setWarning({ ...localWarning });
      }, 4000);

      return;
    }

    try {
      const response = await api.post("/login", {
        email: forms.email,
        password: forms.password,
      });

      const { token, user } = response.data;

      setUser(user);
      setItem("token", token);

      const localWarning = { ...warning };
      localWarning.active = true;
      localWarning.type = "success";
      localWarning.message = "Login feito com sucesso!";
      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.type = "error";
        localWarning.message = "";

        setWarning({ ...localWarning });
        setForms({
          email: "",
        });
        navigate("/home");
      }, 1000);
    } catch (error) {
      const localWarning = { ...warning };

      localWarning.active = true;
      localWarning.message = error.response.data;

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.type = "error";
        localWarning.message = "";

        setWarning({ ...localWarning });
      }, 3000);
    }
  };

  useEffect(() => {
    const token = getItem("token");

    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className='login'>
      <div className='login-left'>
        <span className='login-left__text'>
          Gerencie todos os pagamentos da sua empresa em um só lugar.
        </span>
      </div>
      <div className='login-right'>
        <h1 className='title'>Faça seu login!</h1>
        <form className='form' onSubmit={handleSubmit}>
          <Input
            label='E-mail'
            width='344px'
            type='email'
            id='email'
            placeholder='Digite seu e-mail'
            inputName='email'
          />
          <Input
            label='Senha'
            width='344px'
            type='password'
            id='password'
            alert='Esqueceu a senha?'
            placeholder='Digite sua senha'
            inputName='password'
            eyeIcon={true}
          />
          <BasicButtons
            variant='contained'
            action='Entrar'
            width='160px'
            marginTop='40px'
          />
        </form>
        <span className='redirect'>
          Ainda não possui uma conta?{" "}
          <Link to='/sign-up'>
            <span className='redirect__alert cursor-pointer'>Cadastre-se</span>
          </Link>
        </span>
      </div>
      {warning.active && (
        <Alert variant='filled' severity={warning.type} sx={alert}>
          {warning.message}
        </Alert>
      )}
    </div>
  );
};

export default Login;
