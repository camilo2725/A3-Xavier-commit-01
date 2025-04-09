import './ListaDropdown.css'

export const ListaDropdown = (props) => {
    return (
        <div className="lista-dropdown">
            <label>{props.label}</label>
            <select onChange={event => props.aoAlterar(event.target.value)} required={props.obrigatorio} value={props.valor} >
                <option value=""></option>
                {props.itens.map(item => <option key={item}>{item}</option>)}
            </select>
        </div>
    );
}