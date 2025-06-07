import './LoginForm.css';
import { CampoTexto } from '../CampoTexto';
import { useState } from 'react';
import { Botao } from '../Botao';
import { useUser } from '../../context/userContext';

export const LoginForm = ({ onLogin, onToggle }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUsuario } = useUser(); // Apenas esta linha foi adicionada

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Preencha todos os campos.");
            return;
        }

        onLogin({ email, senha: password });;
    };

    return (
        <section className="form-container">
            <form className="formulario" onSubmit={handleLogin}>
                <h2>Faça o login:</h2>
                {error && <p className="error-message">{error}</p>}
                <CampoTexto label="Email" required valor={email} aoAlterado={setEmail} placeholder="seu@email.com" />
                <CampoTexto label="Senha" required valor={password} aoAlterado={setPassword} placeholder="Sua senha" />
                <div className="button-wrapper">
                    <Botao text="Entrar" />
                </div>
                <p className="toggle-link">
                    Ainda não tem conta? <span onClick={onToggle}>Cadastre-se</span>
                </p>
            </form>
        </section>
    );
};
