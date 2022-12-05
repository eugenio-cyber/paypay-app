import "./styles.css";

import api from "../../services/api";

import { useContext } from "react";
import UserContext from "../../context/userContext";

import closeIcon from "../../assets/close.svg";
import attention from "../../assets/alertSymbol.svg";


function ModalCharge() {

    const { formCharge, getItem, getCharges, showModal, setShowModal, setShowPopupDel } = useContext(UserContext)

    async function handleDeleteCharge(chargeId) {

        try {
            await api.delete(`/charges/${chargeId}`, {
                headers: {
                    authorization: "Bearer " + getItem("token")
                }
            });

            getCharges();

            setTimeout(() => {
                setShowPopupDel({
                    successful: true
                })
            }, 1000);

            setTimeout(() => {
                setShowPopupDel({
                    successful: false
                })
            }, 10000);
        }
        catch (error) {

            setTimeout(() => {
                setShowPopupDel({
                    failed: true
                })
            }, 1000);

            setTimeout(() => {
                setShowPopupDel({
                    failed: false
                })
            }, 10000);

        }
        finally {
            handleCloseModal();
        }
    }

    function handleCloseModal() {

        const localShowModal = { ...showModal };

        localShowModal.alertCharge = false;
        setShowModal({ ...localShowModal });

    }

    return (
        <div className="container-alert">
            <div className="card-warning">
                <img alt='Botão fechar' src={closeIcon} className='close-icon' onClick={handleCloseModal} />
                <img alt='Símbolo de alerta' src={attention} className='alert-img' />
                <h3>Tem certeza que deseja excluir esta cobrança?</h3>
                <div className="btn-alert">
                    <button onClick={handleCloseModal}>Não</button>
                    <button onClick={() => handleDeleteCharge(formCharge.chargeId)}>Sim</button>
                </div>
            </div>
        </div>
    )
}

export default ModalCharge;