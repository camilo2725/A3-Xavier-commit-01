import { Colaborador } from '../Colaborador'
import './Time.css'

export const Time = (props) => {

    //  OBS! Também é possível utilizar a seguinte sintaxe:   "const css = {backgroundColor: props.corSecundaria}", passando style={css} pra section

    return (

        (props.membros.length > 0) ? <section
            className="time" style={{ backgroundColor: props.corSecundaria }}>
            <h3 style={{ borderColor: props.corPrimaria }}>{props.nome}</h3>

            <div className="colaboradores">
                {props.membros.map(membro => <Colaborador corDeFundo={props.corPrimaria} key={membro.nome} nome={membro.nome} cargo={membro.cargo} imagem={membro.imagem} />)}
            </div>
        </section>
            : ""
    )
}