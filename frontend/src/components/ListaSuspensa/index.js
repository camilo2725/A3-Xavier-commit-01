import './ListaSuspensa.css'

export const ListaSuspensa = ({ label, items, valor, aoAlterado, required = true }) => {
    return (<div className="lista-suspensa">
        <label>{label}</label>
        <select required={required} value={valor} onChange={evento => aoAlterado(evento.target.value)}>
            <option />
            {items.map(item => <option key={item}>{item}</option>)}
        </select>
    </div>)
}