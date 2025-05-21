import './NavBar.css';
import { useState } from 'react';
import cargos from '../../props';



export const NavBar = ({ cargos, onSelectOperation }) => {

    const [selectedOperation, setSelectedOperation] = useState('');

    const avatarMap = {
        gerente: '/images/manager.jpg',
        atendente: '/images/receptionist.jpg',
        garçom: '/images/waiter.jpg',
    };

    const submitOperation = (action) => {
        setSelectedOperation(action)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }


    onSelectOperation(selectedOperation);

    return (
        <nav className="navbar navbar-dark fixed-top custom-navbar">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">RU da UNIFACS</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end custom-navbar" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Funcionário</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>

                    <div className="d-flex flex-column align-items-center p-6">
                        {cargos.map((role, index) => (
                            <div key={index} className="text-center mb-5">
                                <img
                                    src={avatarMap[role]}
                                    alt={role}
                                    className="rounded-circle border border-light"
                                    width="120"
                                    height="120"
                                />
                                <div className="text-light mt-3" style={{ textTransform: 'capitalize' }}>
                                    {role}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Main</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Operações disponíveis
                                </a>
                                <ul className="dropdown-menu custom-dropmenu">
                                    <li><a className="dropdown-item" onClick={() => submitOperation('action1')}>Listar funcionários</a></li>
                                    <li><a className="dropdown-item" onClick={() => submitOperation('action2')}>Listar reservas</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" onClick={() => submitOperation('somethingElse')}>Something else here</a></li>
                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex mt-3" role="search" onSubmit={handleSubmit}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-success" type="submit" data-bs-dismiss="offcanvas">BUSCAR</button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
};
