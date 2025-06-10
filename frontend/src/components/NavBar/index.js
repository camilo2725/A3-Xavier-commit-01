export const NavBar = ({ cargo, nome, onOperacaoSelect, logout }) => {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <a className="navbar-brand text-white">
                {cargo === "Atendente" && "Sistema de Reserva"}
                {cargo === "Garçom" && "Confirmação de reserva"}
                {cargo === "Gerente" && "Relatórios"}
                {!["Atendente", "Garçom", "Gerente"].includes(cargo) && "Sistema"}
            </a>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={logout}>Logout</a>
                    </li>
                </ul>
            </div>

            <div className="user-welcome d-flex align-items-center ms-auto me-3">
                <span className="user-name text-white">Seja bem vindo(a), {nome}!</span>
            </div>
        </nav>
    );
};
