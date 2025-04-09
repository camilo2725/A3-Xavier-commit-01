import { useState } from 'react';
import Banner from './componentes/Banner/Banner';
import { Formulario } from './componentes/Formulario';
import { Time } from './componentes/Time';
import { Footer } from './componentes/Footer';


function App() {

  const times = [
    {
      nome: 'Front-End',
      corPrimaria: '#57C278',
      corSecundaria: '#D9F7E9'
    },

    {
      nome: 'Back-End',
      corPrimaria: '#82CFFA',
      corSecundaria: '#E8F8FF'
    },
    {
      nome: 'Banco de Dados',
      corPrimaria: '#A6D157',
      corSecundaria: '#F0F8E2'
    },
    {
      nome: 'Documentação',
      corPrimaria: '#E06B69',
      corSecundaria: '#FDE7E8'
    },
    {
      nome: 'Segurança',
      corPrimaria: '#DB6EBF',
      corSecundaria: '#FAE9F5'
    },
    {
      nome: 'Design',
      corPrimaria: '#FFBA05',
      corSecundaria: '#FFF5D9'
    },
    {
      nome: 'Certificado',
      corPrimaria: '#FF8A29',
      corSecundaria: '#FFEEDF'
    }
  ]

  const [membros, setMembro] = useState([])

  const novoMembro = (membro) => {
    setMembro([...membros, membro])
  }

  return (
    <div className="App">
      <Banner />
      <Formulario times={times.map(time => time.nome)} membroCadastrado={membro => novoMembro(membro)} />
      {times.map(time =>
        <Time
          key={time.nome}
          nome={time.nome}
          corPrimaria={time.corPrimaria}
          corSecundaria={time.corSecundaria}
          membros={membros.filter(membro => membro.time === time.nome)}
        />)}
      <Footer />
    </div>


  );
}

export default App;
