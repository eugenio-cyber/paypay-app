import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useLocalStorage } from "react-use";
import SideBarLayout from "./components/SideBarLayout";
import UserContext from "./context/userContext";
import Charges from "./pages/Charges";
import Client from "./pages/Client";
import Clients from "./pages/Clients";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Sign-up";
import api from "./services/api";
import { getItem } from "./utils/storage";

const ProtectRoutes = ({ redirectTo }) => {
  const isAuthenticated = getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default function TheRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({});
  const [currentClient, setCurrentClient] = useState({});
  const [charges, setCharges] = useState([]);
  const [statusCharges, setStatusCharges] = useState("");
  const [cliente, setCliente, removeCliente] = useLocalStorage("cliente", {});
  const [showOption, setShowOption] = useState(false);

  const [forms, setForms] = useState({
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

  const [panel, setPanel] = useState({
    defaultings: {},
    legals: {},
    pagos: {},
    pendentes: {},
    vencidos: {},
  });

  const [formCharge, setFormCharge] = useState({
    name: "",
    description: "",
    clientId: 0,
    value: "",
    pay: "Pendente",
    dueDate: "",
    chargeId: 0,
  });

  const [viaCep, setViaCep] = useState({
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
  });

  const [showModal, setShowModal] = useState({
    addCharge: false,
    editCharge: false,
    addClient: false,
    editUser: false,
    alertCharge: false,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);

  const [showPopupCharge, setShowPopupCharge] = useState({
    successful: false,
    failed: false,
  });

  const [showPopupDel, setShowPopupDel] = useState({
    successful: false,
    failed: false,
  });

  const [clientCharges, setClientCharges] = useState([]);
  const [warning, setWarning] = useState({
    active: false,
    message: "",
    type: "error",
  });

  const getCharges = async () => {
    try {
      const { data: charges } = await api.get("/charges", {
        headers: {
          Authorization: "Bearer " + getItem("token"),
        },
      });

      if (!statusCharges) {
        setCharges([...charges]);
      } else {
        const filteredCharges = charges.filter((charge) => {
          return charge.status === statusCharges;
        });
        setCharges([...filteredCharges]);
      }
    } catch (error) {
      const localWarning = { ...warning };
      localWarning.active = true;
      localWarning.message = error.response;

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";
        setWarning({ ...localWarning });
      }, 4000);
    }
  };

  async function handleCep(pcep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${pcep}/json/`);
      const { cep, logradouro, complemento, bairro, localidade, uf } =
        await response.json();
      setViaCep({
        ...viaCep,
        cep: cep.replace("-", ""),
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
      });
      return;
    } catch (error) {
      console.log(error.message);
    }
  }

  const getUser = async () => {
    try {
      const { data: user } = await api.get("/users", {
        headers: {
          Authorization: "Bearer " + getItem("token"),
        },
      });

      setCurrentUser({ ...user });
      removeUsuario("usuario");
      setUsuario({ ...user });
    } catch (error) {
      const localWarning = { ...warning };
      localWarning.active = true;
      localWarning.message = error.response;

      setWarning({ ...localWarning });

      setTimeout(() => {
        localWarning.active = false;
        localWarning.message = "";
        setWarning({ ...localWarning });
      }, 4000);
    }
  };

  async function showClients() {
    try {
      const token = getItem("token");
      const response = await api.get("/clients", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (statusClient.length === 0) {
        setClientsList(response.data);
      } else {
        const filteredClients = response.data.filter((client) => {
          return client.status === statusClient;
        });
        setClientsList([...filteredClients]);
        setStatusClient("");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const [statusClient, setStatusClient] = useState("");
  const [clientsList, setClientsList] = useState([]);
  const [usuario, setUsuario, removeUsuario] = useLocalStorage("usuario", {});
  const [order, setOrder] = useState(true);

  async function handleLoadChargesClient() {
    try {
      const url = `/client/${cliente.id}/charge`;
      const token = getItem("token");
      const response = await api.get(url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setClientCharges(response.data);
    } catch (error) {
      console.error(error);
    }
    return;
  }

  useEffect(() => {
    setWarning({
      active: false,
      message: "",
      type: "error",
    });
  }, [location]);

  return (
    <UserContext.Provider
      value={{
        Alert,
        charges,
        cliente,
        clientsList,
        clientCharges,
        currentClient,
        currentUser,
        forms,
        formCharge,
        getCharges,
        getItem,
        getUser,
        handleCep,
        Link,
        navigate,
        order,
        panel,
        removeCliente,
        removeUsuario,
        setCharges,
        setClientsList,
        setCliente,
        setClientCharges,
        setCurrentClient,
        setCurrentUser,
        setFormCharge,
        setForms,
        setOrder,
        setPanel,
        setShowModal,
        setShowOption,
        setShowPopup,
        setShowPopupCharge,
        setShowPopupDel,
        setShowPopupEdit,
        setUsuario,
        setViaCep,
        setWarning,
        showClients,
        showModal,
        showOption,
        showPopup,
        showPopupCharge,
        showPopupDel,
        showPopupEdit,
        statusClient,
        setStatusClient,
        statusCharges,
        setStatusCharges,
        usuario,
        viaCep,
        warning,
        useLocalStorage,
        handleLoadChargesClient,
      }}
    >
      <Routes>
        <Route path='/'>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
        </Route>

        <Route path='/sign-up' element={<SignUp />} />

        <Route element={<ProtectRoutes redirectTo='/' />}>
          <Route element={<SideBarLayout />}>
            <Route path='/home' element={<Home />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/detail' element={<Client />} />
            <Route path='/charges' element={<Charges />} />
          </Route>
          <Route path='*' element='Página não encontrada' />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}
