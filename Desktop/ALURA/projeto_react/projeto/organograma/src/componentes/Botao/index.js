import './Botao.css'

export const Botao = (props) => {
    return (
        <button className="botao-card">{props.children}</button>
    );
}