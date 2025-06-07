import { useEffect, useState } from 'react';
import { SignUpForm } from './components/SignUpForm';
import { LoginForm } from './components/LoginForm';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { loginUsuario } from './services/userServiceAPI';
import { Home } from './Home';
import {
  getLoggedUser,
  saveLoggedUser,
  logoutUser
} from './services/userService';
import api from './services/axiosClient';


function App() {
  const cargos = ["Gerente", "Garçom", "Atendente"];
  const [isLogin, setIsLogin] = useState(true);
  const [userLogged, setUserLogged] = useState(null);
  const navigate = useNavigate();


  const handleLogin = async ({ email, senha }) => {
    try {
      const user = await loginUsuario(email, senha);
      saveLoggedUser(user);
      setUserLogged(user);
      alert(`Bem-vindo, ${user.nome}!`);
      navigate('/Home');
    } catch (err) {
      alert(err);
    }
  };


  const logout = () => {
    setUserLogged(null);
    logoutUser();
    setIsLogin(true);
    navigate('/');
  };

  useEffect(() => {
    const user = getLoggedUser();
    if (user) {
      setUserLogged(user);
    }
  }, []);


  const aoCadastrar = async (novoUsuario) => {
    try {
      await api.post('/usuario', novoUsuario);
      alert("Cadastro feito com sucesso!");
      setIsLogin(true);
    } catch (e) {
      alert("Erro ao cadastrar usuário.");
    }
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
            <div className="login-container">
              <div className="login-form">
                <h2>Olá, {userLogged.nome}!</h2>
                <p>Você está logado como <strong>{userLogged.cargo}</strong>.</p>
                <button className="btn btn-danger mt-3" onClick={logout}>Sair</button>
              </div>
            </div>
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
