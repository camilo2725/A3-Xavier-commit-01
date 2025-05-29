import { useEffect, useState } from 'react';
import { SignUpForm } from './components/SignUpForm';
import { LoginForm } from './components/LoginForm';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './Home';
import {
  getUsers,
  addUser,
  findUserByEmailAndPassword,
  getLoggedUser,
  saveLoggedUser,
  logoutUser,
  saveUsers
} from './utils/userService';



const USUARIO_FAKE_SEED = [
  { nome: 'Alice', email: 'alice@email.com', senha: '123456', cargo: 'Gerente' },
  { nome: 'Bob', email: 'bob@email.com', senha: 'senha123', cargo: 'Garçom' },
  { nome: 'Gustavo', email: 'gustavo@email.com', senha: '123456', cargo: 'Atendente' },
  { nome: 'Alberto', email: 'alberto@email.com', senha: '654321', cargo: 'Gerente' }
];

function App() {
  const cargos = ["Gerente", "Garçom", "Atendente"];
  const [isLogin, setIsLogin] = useState(true);
  const [userLogged, setUserLogged] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const existingUsers = getUsers();
    const alreadySeeded = localStorage.getItem("seeded");

    if (!alreadySeeded || existingUsers.length === 0) {
      saveUsers(USUARIO_FAKE_SEED);
      localStorage.setItem("seeded", "true");
      console.log("Seed de usuários salvo no localStorage.");
    }

    const user = getLoggedUser();
    if (user) {
      setUserLogged(user);
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
    console.log('Usuários salvos:', getUsers());
    const user = findUserByEmailAndPassword(email, senha);
    if (!user) {
      alert("Email ou senha inválidos.");
      return;
    }
    saveLoggedUser(user); // 👈 Salva no localStorage
    setUserLogged(user);
    alert(`Bem-vindo, ${user.nome}!`);
    navigate('/Home');
  };

  const logout = () => {
    setUserLogged(null);
    logoutUser(); // 👈 Remove do localStorage
    setIsLogin(true);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="main-container">
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
        </div>
      } />
      <Route path="/Home"
        element={
          userLogged ? (
            <Home user={userLogged} logout={logout} />
          ) : (
            <p>Carregando usuário...</p>
          )
        } />
    </Routes>
  );
}

export default App;

