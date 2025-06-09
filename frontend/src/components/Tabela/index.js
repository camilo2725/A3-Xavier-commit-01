import React from "react";
import './Tabela.css';

export const Tabela = ({ colunas, dados }) => {
    return (
        <div className="tabela-container">
            <div className="table-wrapper">
                <table className="table table-striped table-dark tabela-personalizada">
                    <thead>
                        <tr>
                            {colunas.map((coluna, index) => (
                                <th key={index}>{coluna}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dados.map((linha, idx) => (
                            <tr key={idx}>
                                {colunas.map((coluna, i) => (
                                    <td key={i}>{linha[coluna]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
