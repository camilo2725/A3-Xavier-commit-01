import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import Reserva from '../../models/Reserva';
import { saveReservas } from '../../utils/userService';
import { definirTipoModal } from '../../utils/modalUtils';
import './FormHome.css';

export const FormHome = ({ reservas, setReservas }) => {
    const [formData, setFormData] = useState({
        data: '',
        hora: '',
        numeMesa: '',
        quantPessoas: '',
        nomeRespons: '',
        statusMesa: 'reservada',
    });

    const [mensagem, setMensagem] = useState('');
    const [erros, setErros] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMensagem, setModalMensagem] = useState('');
    const [modalTipo, setModalTipo] = useState('sucesso');

    // ✅ Função utilitária reutilizável
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

    const handleCriar = (e) => {
        e.preventDefault();

        const { sucesso, reserva: novaReserva, mensagem } = Reserva.criarReserva(formData, reservas);

        if (!sucesso) {
            setModalTipo(definirTipoModal(mensagem));
            setModalMensagem(mensagem);
            setShowModal(true);
            return;
        }

        adicionarReserva(novaReserva);

        setMensagem(`Reserva criada com sucesso para a mesa ${novaReserva.numeMesa}!`);
        setShowModal(true);
        setModalTipo('sucesso');
        setModalMensagem(`Reserva criada com sucesso para a mesa ${novaReserva.numeMesa}!`);
    };

    const handleCancelar = (e) => {
        e.preventDefault();

        const numeroMesa = parseInt(formData.numeMesa);
        const reservaEncontrada = reservas.find(
            r => r.numeMesa === numeroMesa && r.statusMesa !== 'cancelada'
        );

        if (!reservaEncontrada) {
            setModalTipo('erro');
            setModalMensagem(`Nenhuma reserva ativa encontrada para a mesa ${numeroMesa}.`);
            setShowModal(true);
            return;
        }

        const resultado = reservaEncontrada.cancelar(formData.data, formData.hora);

        setReservas(prev => {
            const atualizadas = [...prev];
            saveReservas(atualizadas);
            return atualizadas;
        });

        setModalTipo(resultado.mensagem.includes('não pode') || resultado.mensagem.includes('discrepância') ? 'erro' : 'sucesso');
        setModalMensagem(resultado.mensagem);
        setShowModal(true);

        setFormData({ data: '', hora: '', nomeRespons: '', numeMesa: '', quantPessoas: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const novaReserva = new Reserva({
            data: formData.data,
            hora: formData.hora,
            numeMesa: parseInt(formData.numeMesa),
            quantPessoas: parseInt(formData.quantPessoas),
            nomeRespons: formData.nomeRespons,
            statusMesa: formData.statusMesa
        });

        const result = novaReserva.validate();

        if (!result.valid) {
            setErros(result.errors);
            setMensagem('');
        } else {
            setErros([]);
            setMensagem(`Reserva criada com sucesso para a mesa ${novaReserva.numeMesa}!`);
            // Aqui você pode armazenar em algum estado global, enviar para backend, etc.
        }
    };

    useEffect(() => {
        console.log("Reservas atualizadas:", reservas);
    }, [reservas]);

    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                setMensagem('');
            }, 3000); // 3 segundos

            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    return (
        <div className='formhome-container'>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="data">Data</label>
                        <input type="text" className="form-control rounded-sm" name="data" value={formData.data} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="hora">Hora</label>
                        <input type="text" className="form-control rounded-sm" name="hora" value={formData.hora} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="numeMesa">Número da mesa</label>
                        <input type="number" className="form-control" name="numeMesa" value={formData.numeMesa} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantPessoas">Total de pessoas</label>
                        <input type="number" className="form-control" name="quantPessoas" value={formData.quantPessoas} onChange={handleChange} required />
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

