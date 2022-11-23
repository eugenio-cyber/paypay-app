import './modalSuccess.css';
import circle from '../../assets/Ellipse.svg';
import checkedIcon from '../../assets/Checked.svg';

function ModalSuccess() {
    return (
        <div className="card-success">
            <div className="success-imgs">
                <img alt='Circulo' src={circle} />
                <img alt='Ícone de checado' src={checkedIcon} className="checked-img" />
            </div>
            <h2 className='title'>Cadastro realizado com sucesso!</h2>
        </div>
    )
}

export default ModalSuccess;