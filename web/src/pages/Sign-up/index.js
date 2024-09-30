import BasicButtons from "../../components/Button";
import Input from "../../components/Input";
import ModalSuccess from "../../components/ModalSuccess/modalSuccess";
import VerticalLinearStepper from "../../components/stepper";
import "./style.css";

import { alert } from "../../global";
import api from "../../services/api";

import { useContext, useState } from "react";
import UserContext from "../../context/userContext";

function SignUp() {
  const { Link, forms, warning, setWarning, Alert } = useContext(UserContext);

  let [stepPage, setStepPage] = useState(1);

  async function handleSubmit(evt) {
    evt.preventDefault();

    const localWarning = { ...warning };

    if (stepPage === 1) {
      if (!forms.name.trim() || !forms.email) {
        localWarning.active = true;
        localWarning.message = "Campos vazios não serão aceitos.";

        setWarning({ ...localWarning });

        setTimeout(() => {
          localWarning.active = false;
          localWarning.message = "";

          setWarning({ ...localWarning });
        }, 4000);

        return;
      }
    } else {
      if (forms.password.length < 5) {
        localWarning.active = true;
        localWarning.message =
          "O tamanho mínimo para a senha é de 6 caracteres";

        setWarning({ ...localWarning });

        setTimeout(() => {
          localWarning.active = false;
          localWarning.message = "";

          setWarning({ ...localWarning });
        }, 4000);

        return;
      }

      if (forms.password !== forms.repeatedPassword) {
        localWarning.active = true;
        localWarning.message = "As senhas estão diferentes";

        setWarning({ ...localWarning });

        setTimeout(() => {
          localWarning.active = false;
          localWarning.message = "";

          setWarning({ ...localWarning });
        }, 4000);

        return;
      }

      if (!forms.password.trim() || !forms.repeatedPassword.trim()) {
        localWarning.active = true;
        localWarning.message = "Espaços em brancos não são considerados.";

        setWarning({ ...localWarning });

        setTimeout(() => {
          localWarning.active = false;
          localWarning.message = "";

          setWarning({ ...localWarning });
        }, 4000);

        return;
      }

      try {
        await api.post("/users", {
          name: forms.name,
          email: forms.email,
          password: forms.password,
        });
      } catch (error) {
        localWarning.active = true;
        localWarning.message = error.response.data;

        setWarning({ ...localWarning });

        setTimeout(() => {
          localWarning.active = false;
          localWarning.message = "";

          setWarning({ ...localWarning });
        }, 4000);

        setStepPage(1);
        return;
      }
    }
    setStepPage((stepPage += 1));
  }

  return (
    <div className='sign-up'>
      <div className='left__sign-up'>
        <VerticalLinearStepper stepPage={stepPage} />
      </div>
      <div className='right__sign-up'>
        <h2 className='title'>Adicione seus dados</h2>
        <form className='form' onSubmit={handleSubmit}>
          {stepPage === 1 && (
            <>
              <Input
                label='Nome*'
                width={368}
                type='text'
                id='nome'
                placeholder='Digite seu nome'
                inputName='name'
              />

              <Input
                label='E-mail*'
                width={368}
                type='email'
                id='email'
                placeholder='Digite seu e-mail'
                inputName='email'
              />
            </>
          )}

          {stepPage === 2 && (
            <>
              <Input
                label='Senha*'
                width={344}
                type='password'
                id='password'
                placeholder='Digite sua senha'
                eyeIcon={true}
                inputName='password'
              />

              <Input
                label='Repita a senha*'
                width={344}
                type='password'
                id='password2'
                placeholder='Repita sua senha'
                eyeIcon={true}
                inputName='repeatedPassword'
              />
            </>
          )}

          {stepPage === 3 && <ModalSuccess />}

          {stepPage === 3 ? (
            <Link to='/Login'>
              <BasicButtons
                variant='contained'
                action='Ir para Login'
                width='160px'
                marginTop='26px'
              />
            </Link>
          ) : (
            <BasicButtons
              variant='contained'
              action={stepPage === 1 ? "Continuar" : "Finalizar cadastro"}
              width={stepPage === 1 ? "160px" : "200px"}
              marginTop='26px'
            />
          )}
        </form>

        {stepPage !== 3 && (
          <span className='redirect'>
            Já possui uma conta? Faça seu{" "}
            <Link to='/Login'>
              <span className='redirect__alert cursor-pointer'>Login</span>
            </Link>
          </span>
        )}

        <div className='step-bars'>
          <div className={stepPage === 1 ? "color-green" : "color-gray"}></div>
          <div className={stepPage === 2 ? "color-green" : "color-gray"}></div>
          <div className={stepPage === 3 ? "color-green" : "color-gray"}></div>
        </div>
      </div>
      {warning.active && (
        <Alert variant='filled' severity={warning.type} sx={alert}>
          {warning.message}
        </Alert>
      )}
    </div>
  );
}

export default SignUp;
