import './SignUpForm.css';
import { CampoTexto } from '../CampoTexto';
import { ListaSuspensa } from '../ListaSuspensa';
import { useState } from 'react';
import { Botao } from '../Botao';

export const SignUpForm = ({ cargos, aoCadastrar, onToggle }) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargo, setCargo] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

        if (!nome || !nomeRegex.test(nome)) return 'Nome inválido.';
        if (!email || !emailRegex.test(email)) return 'Email inválido.';
        if (!password || password.length < 6) return 'Senha muito curta.';
        if (!cargo) return 'Selecione um cargo.';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate();
        if (err) {
            setError(err);
            return;
        }

        setError('');

        aoCadastrar({
            nome,
            email,
            senha: password,
            cargo
        });

        setNome('');
        setEmail('');
        setPassword('');
        setCargo('');
    };

    return (
        <section className="form-container">
            <form className="formulario" onSubmit={handleSubmit}>
                <h2>Crie sua conta:</h2>
                {error && <p className="error-message">{error}</p>}
                <CampoTexto label="Nome" required valor={nome} aoAlterado={setNome} placeholder="Seu nome completo" />
                <CampoTexto label="Email" required valor={email} aoAlterado={setEmail} placeholder="seu@email.com" />
                <CampoTexto label="Senha" required valor={password} aoAlterado={setPassword} placeholder="Mínimo 6 caracteres" type={showPassword ? "text" : "password"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Ocultar" : "Mostrar"}
                </button>
                <ListaSuspensa label="Cargo" required items={cargos} valor={cargo} aoAlterado={setCargo} />
                <Botao text="Cadastrar" disabled={!nome || !email || !password || !cargo} />
                <p className="toggle-link">
                    Já tem uma conta? <span onClick={onToggle}>Faça login</span>
                </p>
            </form>
        </section>
    );
};
