import React, { useState, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { Tabela } from "./components/Tabela";
import { FormHome } from "./components/FormHome";
import { useUser } from "./context/userContext";
import { FormHomeGarcom } from "./components/FormHomeGarcom";
import { saveReservas, getReservas } from './services/userService';
import { criarReserva, buscarReservas } from "./services/userServiceAPI";
import Reserva from "./models/Reserva";
import './Home.css';

export const Home = ({ user, logout }) => {
    const [colunas, setColunas] = useState([]);
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reservas, setReservas] = useState([]);
    const [mostrarTabela, setMostrarTabela] = useState(false);
    const [operacaoSelecionada, setOperacaoSelecionada] = useState('');



    const getImagemPorCargo = (cargo) => {
        const cargoNormalizado = cargo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const imagens = {
            atendente: "/atendente.jpg",
            garcom: "/garcom.jpg",
            gerente: "/gerente.jpg",
        };
        return imagens[cargoNormalizado];
    };

    useEffect(() => {
        async function carregarReservas() {
            try {
                const dadosAPI = await buscarReservas();
                const reservasConvertidas = dadosAPI.map(obj => new Reserva(obj));
                setReservas(reservasConvertidas);
            } catch (error) {
                console.error("Erro ao carregar reservas:", error);
            }
        }

        carregarReservas();
    }, []);

    const getClassePorCargo = (cargo) => {
        const cargoLogado = cargo?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return `home-container-${cargoLogado}`;
    };


    return (
        <div className={`home-container ${getClassePorCargo(user.cargo)}`}>
            <NavBar cargo={user.cargo} nome={user.nome} logout={logout} />

            <div className="form-img-wrapper">
                <div className="left-side">
                    {user.cargo === "atendente" ? (
                        <FormHome reservas={reservas} setReservas={setReservas} />
                    ) : !mostrarTabela ? (
                        <FormHomeGarcom
                            reservas={reservas}
                            setReservas={setReservas}
                            user={user}
                            cargo={user.cargo}
                            setMostrarTabela={setMostrarTabela}
                            setColunas={setColunas}
                            setDados={setDados}
                            setOperacaoSelecionada={setOperacaoSelecionada}
                        />
                    ) : (
                        <>
                            {dados && dados.length > 0 ? (
                                <Tabela colunas={colunas} dados={dados} />
                            ) : (
                                <div className="mensagem-erro">
                                    Não há dados disponíveis para emitir este relatório.
                                </div>
                            )}

                            <button
                                className="btn btn-secondary mt-3"
                                onClick={() => {
                                    setMostrarTabela(false);
                                    setColunas([]);
                                    setDados([]);
                                }}
                            >
                                Voltar
                            </button>
                        </>
                    )}
                </div>

                <div className="img-container">
                    <img
                        className="img-box"
                        src={getImagemPorCargo(user.cargo)}
                        alt={`decoração-${user.cargo}`}
                    />
                </div>
            </div>

            <div className={`footer-transition ${user.cargo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} />
            <footer className="footer">
                © 2025   UNIFACS -  Restaurante Digital
            </footer>
        </div>
    );
};

