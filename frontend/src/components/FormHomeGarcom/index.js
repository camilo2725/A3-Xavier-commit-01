import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { parseDiaMesAno, formatarDataISO, formatarHora } from '../../utils/dateUtils';
import { useUser } from '../../context/userContext';
import { cancelarReserva, buscarReservas } from '../../services/userServiceAPI';
import { Garcom } from '../../utils/Usuarios';
import './FormHomeGarcom.css';

export const FormHomeGarcom = ({
    reservas,
    setReservas,
    cargo,
    setMostrarTabela,
    setColunas,
    setDados,
    setOperacaoSelecionada
}) => {
    const [mesaSelecionada, setMesaSelecionada] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMensagem, setModalMensagem] = useState('');
    const [modalTipo, setModalTipo] = useState('sucesso');
    const [numeroMesaRelatorio, setNumeroMesaRelatorio] = useState('');
    const [dataInicial, setDataInicial] = useState('');
    const [dataFinal, setDataFinal] = useState('');

    const { usuario } = useUser();
    const isGerente = usuario?.cargo === 'gerente';



    const tituloFormulario = isGerente ? 'Selecione uma operação:' : 'Selecionar mesa:';
    const iconeInput = isGerente ? "/sheet.svg" : "/table_bar.svg";

    const opcoesGerente = [
        { value: 'relatorio_reservas_periodo', label: 'Reservas atendidas ou não em um período' },
        { value: 'relatorio_mesa', label: 'Reservas para determinada mesa' },
        { value: 'relatorio_garcom', label: 'Mesas confirmadas por garçom' }
    ];

    const reservasDisponiveis = reservas.filter(r => r.statusMesa === 'reservada' && !r.garcomResponsavel);
    const nomeUsuario = usuario?.cargo === 'garcom' ? (usuario?.nome || 'garcom') : 'gerente';



    const handleConfirmar = async () => {
        if (isGerente) {
            if (!mesaSelecionada) return;

            let mensagem = '';
            let colunasTabela = [];
            let dadosTabela = [];

            switch (mesaSelecionada) {
                case 'relatorio_mesa':
                    if (!numeroMesaRelatorio) {
                        setModalTipo('erro');
                        setModalMensagem('Selecione o número da mesa para gerar o relatório.');
                        setShowModal(true);
                        return;
                    }

                    mensagem = `Relatório de reservas para a mesa ${numeroMesaRelatorio}.`;
                    colunasTabela = ['Mesa', 'Data'];
                    dadosTabela = reservas
                        .filter(r => r.numeMesa.toString() === numeroMesaRelatorio)
                        .map(r => ({
                            Mesa: r.numeMesa,
                            Data: r.data
                        }));
                    break;

                case 'relatorio_garcom':
                    mensagem = 'Relatório de mesas confirmadas por garçom.';
                    colunasTabela = ['Garçom', 'Mesa', 'Status'];

                    dadosTabela = reservas
                        .filter(r => r.garcomResponsavel && r.statusMesa === 'livre')
                        .map(r => ({
                            Garçom: r.garcomResponsavel,
                            Mesa: r.numeMesa,
                            Status: 'confirmada'
                        }));
                    break;

                case 'relatorio_reservas_periodo':
                    const dataInicioParsed = parseDiaMesAno(dataInicial);
                    const dataFimParsed = parseDiaMesAno(dataFinal);

                    if (!dataInicioParsed || !dataFimParsed || dataInicioParsed > dataFimParsed) {
                        setModalTipo('erro');
                        setModalMensagem('Datas inválidas ou fora de ordem. Use o formato DD/MM/AAAA.');
                        setShowModal(true);
                        return;
                    }

                    mensagem = 'Relatório de reservas no período selecionado.';
                    colunasTabela = ['Mesa', 'Data', 'Hora', 'Status'];
                    dadosTabela = reservas
                        .filter(r => {
                            const dataReserva = parseDiaMesAno(r.data);
                            return dataReserva && dataReserva >= dataInicioParsed && dataReserva <= dataFimParsed;
                        })
                        .map(r => ({
                            Mesa: r.numeMesa,
                            Data: r.data,
                            Hora: r.hora,
                            Status: r.statusMesa
                        }));
                    break;

                default:
                    mensagem = 'Operação desconhecida.';
            }

            setModalTipo('sucesso');
            setModalMensagem(mensagem);
            setShowModal(true);

            setTimeout(() => {
                setColunas(colunasTabela);
                setDados(dadosTabela);
                setOperacaoSelecionada(mesaSelecionada);
                setMostrarTabela(true);
            }, 1500);

            return;
        }

        if (!mesaSelecionada) return;

        const [mesaSelecionadaNumero, mesaSelecionadaData] = mesaSelecionada.split('_');

        const reservaIndex = reservas.findIndex(
            r => r.numeResa.toString() === mesaSelecionadaNumero &&
                r.data === mesaSelecionadaData &&
                r.statusMesa === 'reservada'
        );

        if (reservaIndex === -1) {
            setModalTipo('erro');
            setModalMensagem('Reserva não encontrada ou já foi confirmada/atendida.');
            setShowModal(true);
            return;
        }

        const novasReservas = [...reservas];
        const reservaSelecionada = novasReservas[reservaIndex];

        let mensagem = '';

         try {
        // Chamada à API para confirmar a reserva no backend
        console.log('Enviando confirmação para reserva ID:', reservaSelecionada.id);
        const resposta = await confirmarReservaAPI(reservaSelecionada.id); // Supondo que a reserva tenha um ID
        console.log('Resposta completa da API:', resposta);

        if (resposta.sucesso) {
            // Atualiza o estado local
            console.log('Atualizando estado local para mesa:', reservaSelecionada.numeMesa);
            const novasReservas = [...reservas];
            novasReservas[reservaIndex].statusMesa = 'livre';
            novasReservas[reservaIndex].garcomResponsavel = usuario.nome;

            setReservas(novasReservas);
            setModalTipo('sucesso');
            setModalMensagem("Mesa confirmada com sucesso");
            setShowModal(true);
        } else {
            setModalTipo('erro');
            setModalMensagem(resposta.mensagem || "Erro ao confirmar a reserva.");
            setShowModal(true);
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        setModalTipo('erro');
        setModalMensagem("Erro ao conectar com o servidor.");
        setShowModal(true);
    }
        setReservas(novasReservas);

        setModalTipo('sucesso');
        setModalMensagem("Mesa confirmada com sucesso");
        setShowModal(true);
    };

    useEffect(() => {
        console.log("Reservas atualizadas:", reservas);
    }, [reservas]);

    console.log("Reservas disponíveis:", reservasDisponiveis);

    return (
        <div className='formhome-container'>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group input-responsavel">
                    <label className='form-title'>{tituloFormulario}</label>
                    <div className="input-icon-wrapper">
                        {!isGerente && reservasDisponiveis.length === 0 ? (
                            <p className="text-danger mt-1 px-2 py-2 rounded" style={{ backgroundColor: '#f8d7da' }}>
                                Não há reservas disponíveis para confirmar.
                            </p>
                        ) : (
                            <>
                                <img src={iconeInput} alt="Ícone input" className="input-icon" />
                                <select
                                    className="form-control input-with-icon"
                                    value={mesaSelecionada}
                                    onChange={(e) => setMesaSelecionada(e.target.value)}
                                >
                                    <option value="" disabled hidden>-- {isGerente ? 'Selecione uma operação' : 'Escolha uma mesa'} --</option>
                                    {isGerente
                                        ? opcoesGerente.map((op, idx) => (
                                            <option key={idx} value={op.value}>{op.label}</option>
                                        ))
                                        : reservasDisponiveis.map((res, idx) => (
                                            <option key={idx} value={`${res.numeMesa}_${res.data}`}>
                                                Mesa - {res.numeMesa} | Dia - {formatarDataISO(res.data)} | Hora - {formatarHora(res.hora)}
                                            </option>
                                        ))
                                    }
                                </select>
                            </>
                        )}
                    </div>
                </div>

                {isGerente && mesaSelecionada === 'relatorio_mesa' && (
                    <div className="form-group input-responsavel">
                        <label className='form-title'>Número da mesa:</label>
                        <div className="input-icon-wrapper">
                            <img src="/table_bar.svg" alt="Ícone mesa" className="input-icon" />
                            <input
                                type="text"
                                className="form-control input-with-icon"
                                placeholder="Ex: 5"
                                value={numeroMesaRelatorio}
                                onChange={(e) => setNumeroMesaRelatorio(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {isGerente && mesaSelecionada === 'relatorio_mesa' && (
                    <div className="form-group input-responsavel">
                        <label className='form-title'>Selecione o número da mesa:</label>
                        <div className="input-icon-wrapper">
                            <img src="/table_bar.svg" alt="Ícone input" className="input-icon" />
                            <select
                                className="form-control input-with-icon"
                                value={numeroMesaRelatorio}
                                onChange={(e) => setNumeroMesaRelatorio(e.target.value)}
                            >
                                <option value="" disabled hidden>-- Escolha uma mesa --</option>
                                {[...new Set(reservas.map(r => r.numeMesa))].map((mesa, idx) => (
                                    <option key={idx} value={mesa}>
                                        Mesa {mesa}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div className="buttons-container">
                    <button className="btn btn-success" type="button" onClick={handleConfirmar}>
                        {isGerente ? 'Publicar relatório' : 'Confirmar'}
                    </button>
                </div>
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
