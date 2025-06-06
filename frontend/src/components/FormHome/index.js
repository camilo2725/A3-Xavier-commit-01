import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import Reserva from '../../models/Reserva';
import { definirTipoModal } from '../../utils/modalUtils';
import { saveReservas } from '../../services/userService';
import { criarReserva } from '../../services/reservaServiceAPI';
import './FormHome.css';

export const FormHome = ({ reservas, setReservas }) => {
    const [formData, setFormData] = useState({
        data: '',
        hora: '',
        numeMesa: '',
        quantPessoas: '',
        nomeRespons: '',
        statusMesa: 'reservada'
    });

    const [erros, setErros] = useState([]);
    const [mensagem, setMensagem] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMensagem, setModalMensagem] = useState('');
    const [modalTipo, setModalTipo] = useState('sucesso');


    const adicionarReserva = (novaReserva) => {
        const atualizadas = [...reservas, novaReserva];
        saveReservas(atualizadas);
        setReservas(atualizadas);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleCriar = async (e) => {
        e.preventDefault();

        const { sucesso, reserva: novaReserva, mensagem } = Reserva.criarReserva(formData, reservas);

        if (!sucesso) {
            setErros([mensagem]);
            setModalTipo(definirTipoModal(mensagem));
            setModalMensagem(mensagem);
            setShowModal(true);
            return;
        }

        try {

            const reservaSalva = await criarReserva(novaReserva);

            setReservas(prev => [...prev, reservaSalva]);
            setMensagem(`Reserva criada com sucesso para a mesa ${novaReserva.numeMesa}!`);
            setModalTipo('sucesso');
            setModalMensagem('Reserva criada com sucesso!');
            setShowModal(true);
            setErros([]);
        } catch (error) {
            setModalTipo('erro');
            setModalMensagem('Erro ao salvar reserva no servidor.');
            setShowModal(true);
        }
    };


    const handleCancelar = (e) => {
    e.preventDefault();

    const numeroMesa = parseInt(formData.numeMesa);

    if (!numeroMesa) {
        return;
    }

    fetch(`http://localhost:3001/api/reserva/${numeroMesa}/cancelar`, {
        method: 'PUT',
        body: JSON.stringify({
            data: formData.data,
            hora: formData.hora
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        setModalTipo('sucesso');
        setModalMensagem(data.mensagem);
        setShowModal(true);
    })
    .catch(error => {
        setModalTipo('erro');
        setModalMensagem('Erro ao tentar cancelar a reserva.');
        setShowModal(true);
    });

    setFormData({ data: '', hora: '', nomeRespons: '', numeMesa: '', quantPessoas: '' });
};
    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                setMensagem('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    return (
        <div className='formhome-container'>
            <form onSubmit={handleCriar}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="data">Data</label>
                        <input type="text" className="form-control rounded-sm" name="data" value={formData.data} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hora">Hora</label>
                        <input type="time" className="form-control rounded-sm" name="hora" value={formData.hora} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numeMesa">Número da mesa</label>
                        <input type="number" className="form-control" name="numeMesa" min="1" max="10" value={formData.numeMesa} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantPessoas">Total de pessoas</label>
                        <input type="number" className="form-control" name="quantPessoas" min="1" max="10" value={formData.quantPessoas} onChange={handleChange} required />
                    </div>
                    <div className="form-group input-responsavel">
                        <label htmlFor="nomeRespons">Responsável</label>
                        <div className="input-icon-wrapper">
                            <img src="/person.svg" alt="Ícone de responsável" className="input-icon" />
                            <input
                                type="text"
                                className="form-control input-with-icon"
                                name="nomeRespons"
                                value={formData.nomeRespons}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="buttons-container">
                    <button className="btn btn-success" type="button" onClick={handleCriar}>Criar reserva</button>
                    <button className="btn btn-danger" type="button" onClick={handleCancelar}>Cancelar reserva</button>
                </div>

                {mensagem && <div className="alert alert-success mt-3">{mensagem}</div>}
                {erros.length > 0 && (
                    <div className="alert alert-danger mt-3">
                        <ul className="mb-0">
                            {erros.map((erro, idx) => <li key={idx}>{erro}</li>)}
                        </ul>
                    </div>
                )}
            </form>

            {showModal && (
                <Modal
                    tipo={modalTipo}
                    mensagem={modalMensagem}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

