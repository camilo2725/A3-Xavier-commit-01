import { useEffect, useState } from 'react';
import { SignUpForm } from './components/SignUpForm';
import { LoginForm } from './components/LoginForm';
import {
  getUsers,
  addUser,
  findUserByEmailAndPassword,
} from './utils/userService';

const USUARIO_FAKE_SEED = [
  { nome: 'Alice', email: 'alice@email.com', senha: '123456', cargo: 'Gerente' },
  { nome: 'Bob', email: 'bob@email.com', senha: 'senha123', cargo: 'Garçom' },
  { nome: 'Carla', email: 'carla@email.com', senha: 'atenp456', cargo: 'Atendente' }
];

function App() {
  const cargos = ["Gerente", "Garçom", "Atendente"];
  const [isLogin, setIsLogin] = useState(true);
  const [userLogged, setUserLogged] = useState(null);

  // Seed users on first load
  useEffect(() => {
    const stored = getUsers();
    if (stored.length === 0) {
      USUARIO_FAKE_SEED.forEach(user => addUser(user)); // uses userService
    }
  }, []);

  const aoCadastrar = (novoUsuario) => {
    try {
      addUser(novoUsuario);
      alert("Cadastro feito com sucesso!");
      setIsLogin(true);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleLogin = ({ email, senha }) => {
    const user = findUserByEmailAndPassword(email, senha);
    if (!user) {
      alert("Email ou senha inválidos.");
      return;
    }
    setUserLogged(user);
    alert(`Bem-vindo, ${user.nome}!`);
  };

  const logout = () => {
    setUserLogged(null);
    setIsLogin(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!userLogged ? (
          isLogin ? (
            <LoginForm onLogin={handleLogin} onToggle={() => setIsLogin(false)} />
          ) : (
            <SignUpForm cargos={cargos} aoCadastrar={aoCadastrar} onToggle={() => setIsLogin(true)} />
          )
        ) : (
          <>
            <h2>Olá, {userLogged.nome}! Você está logado como {userLogged.cargo}.</h2>
            <button onClick={logout}>Sair</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;

