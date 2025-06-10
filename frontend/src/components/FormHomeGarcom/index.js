import { useState } from 'react';
import { Modal } from '../Modal';
import { parseDiaMesAno, formatarHora, formatarDataBrasileira } from '../../utils/dateUtils';
import { confirmarReservaAPI } from '../../services/userServiceAPI';
import './FormHomeGarcom.css';

export const FormHomeGarcom = ({
    reservas,
    setReservas,
    user,
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

    const usuario = user;
    const isGerente = usuario?.cargo?.toLowerCase() === 'gerente';
    const tituloFormulario = isGerente ? 'Selecione uma operação:' : 'Selecionar mesa:';
    const iconeInput = isGerente ? "/sheet.svg" : "/table_bar.svg";

    const opcoesGerente = [
        { value: 'relatorio_reservas_periodo', label: 'Reservas atendidas ou não em um período' },
        { value: 'relatorio_mesa', label: 'Reservas para determinada mesa' },
        { value: 'relatorio_garcom', label: 'Mesas confirmadas por garçom' }
    ];

    const reservasDisponiveis = reservas.filter(r => r.statusMesa === 'reservada' && !r.garcomResponsavel);

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
                    colunasTabela = ['Mesa', 'Data', 'Hora', 'Status'];

                    dadosTabela = reservas
                        .filter(r => r.numeMesa.toString() === numeroMesaRelatorio)
                        .map(r => {
                            const [ano, mes, dia] = r.data.split('/');
                            return {
                                Mesa: r.numeMesa,
                                Data: formatarDataBrasileira(r.data),
                                Hora: formatarHora(r.hora),
                                Status: r.statusMesa,
                                _dataOrdenacao: new Date(ano, mes - 1, dia).getTime()
                            };
                        })
                        .sort((a, b) => b._dataOrdenacao - a._dataOrdenacao)
                        .map(({ _dataOrdenacao, ...rest }) => rest);
                    break;
                case 'relatorio_garcom':
                    mensagem = 'Relatório de mesas confirmadas por garçom.';
                    colunasTabela = ['Garçom', 'Mesa', 'Data', 'Hora', 'Status'];
                    dadosTabela = reservas
                        .filter(r => r.garcomResponsavel && r.statusMesa === 'livre')
                        .map(r => {

                            const [ano, mes, dia] = r.data.split('/');
                            const dataObj = new Date(ano, mes - 1, dia);

                            return {
                                Garçom: r.garcomResponsavel,
                                Mesa: r.numeMesa,
                                Data: formatarDataBrasileira(r.data),
                                Hora: formatarHora(r.hora),
                                Status: 'confirmada',

                                _dataOrdenacao: dataObj.getTime()
                            };
                        })
                        .sort((a, b) => {
                            if (a.Garçom.toLowerCase() < b.Garçom.toLowerCase()) return -1;
                            if (a.Garçom.toLowerCase() > b.Garçom.toLowerCase()) return 1;
                            return b._dataOrdenacao - a._dataOrdenacao;
                        })

                        .map(({ _dataOrdenacao, ...rest }) => rest);
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

                    dadosTabela = reservas.filter(r => {
                        const [ano, mes, dia] = r.data.split('/');
                        const dataReserva = new Date(ano, mes - 1, dia);
                        return dataReserva >= dataInicioParsed && dataReserva <= dataFimParsed;
                    })
                        .map(r => {
                            const [ano, mes, dia] = r.data.split('/');
                            return {
                                Mesa: r.numeMesa,
                                Data: formatarDataBrasileira(r.data),
                                Hora: formatarHora(r.hora),
                                Status: r.statusMesa,
                                _dataOrdenacao: new Date(ano, mes - 1, dia).getTime()
                            };
                        })
                        .sort((a, b) => a._dataOrdenacao - b._dataOrdenacao)
                        .map(({ _dataOrdenacao, ...rest }) => rest);
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


        if (!mesaSelecionada) {
            setModalTipo('erro');
            setModalMensagem('Por favor, escolha uma mesa para confirmar.');
            setShowModal(true);
            return;
        }

        const reservaAConfirmar = reservas.find(r => r.id.toString() === mesaSelecionada);

        if (!reservaAConfirmar) {
            setModalTipo('erro');
            setModalMensagem('Reserva não encontrada ou já foi confirmada/atendida.');
            setShowModal(true);
            return;
        }

        try {
            const resposta = await confirmarReservaAPI(reservaAConfirmar.id, usuario.nome);
            if (resposta.sucesso) {
                const novasReservas = reservas.map(res =>
                    res.id === reservaAConfirmar.id
                        ? { ...res, statusMesa: 'livre', garcomResponsavel: usuario.nome }
                        : res
                );
                setReservas(novasReservas);
                setModalTipo('sucesso');
                setModalMensagem("Mesa confirmada com sucesso!");
                setShowModal(true);
            } else {
                setModalTipo('erro');
                setModalMensagem(resposta.mensagem || "Erro ao confirmar a reserva.");
                setShowModal(true);
            }
        } catch (error) {
            console.error('Erro detalhado ao confirmar reserva:', error);
            setModalTipo('erro');
            setModalMensagem("Erro ao conectar com o servidor.");
            setShowModal(true);
        }
    };

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
                                        : reservasDisponiveis.map((res) => (
                                            <option key={res.id} value={res.id}>
                                                Mesa - {res.numeMesa} | Dia - {res.data} | Hora - {formatarHora(res.hora)}
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
                        <label className='form-title'>Selecione o número da mesa:</label>
                        <div className="input-icon-wrapper">
                            <img src="/table_bar.svg" alt="Ícone input" className="input-icon" />
                            <select
                                className="form-control input-with-icon"
                                value={numeroMesaRelatorio}
                                onChange={(e) => setNumeroMesaRelatorio(e.target.value)}
                            >
                                <option value="" disabled hidden>-- Escolha uma mesa --</option>
                                {[...new Set(reservas.map(r => r.numeMesa))].sort((a, b) => a - b).map((mesa, idx) => (
                                    <option key={idx} value={mesa}>
                                        Mesa {mesa}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {isGerente && mesaSelecionada === 'relatorio_reservas_periodo' && (
                    <div className="date-inputs-container">
                        <div className="form-group input-responsavel">
                            <label className='form-title'>Data Inicial:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="DD/MM/AAAA"
                                value={dataInicial}
                                onChange={(e) => setDataInicial(e.target.value)}
                            />
                        </div>
                        <div className="form-group input-responsavel">
                            <label className='form-title'>Data Final:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="DD/MM/AAAA"
                                value={dataFinal}
                                onChange={(e) => setDataFinal(e.target.value)}
                            />
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