import './CampoTexto.css'


export const CampoTexto = ({ label, placeholder, valor, aoAlterado, type = 'text', required = false }) => {
    return (<div className='campo-texto'>
        <label>{label}</label>
        <input type={type} value={valor} onChange={evento => aoAlterado(evento.target.value)} required={required} placeholder={placeholder} />
    </div>)
};