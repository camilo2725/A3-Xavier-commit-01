import './Modal.css';

export const Modal = ({ tipo = 'sucesso', mensagem, onClose }) => {
    const icone = tipo === 'sucesso' ? '/check_circle.svg' : '/error_circle.svg';
    const titulo = tipo === 'sucesso' ? 'Sucesso!' : 'Erro...';

    return (

        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content" style={{ borderRadius: '1rem' }}>
                    <div className="modal-header d-flex align-items-center">
                        <img
                            src={icone}
                            alt={`Ícone de ${tipo}`}
                            style={{ width: '24px', marginRight: '10px' }}
                        />
                        <h5 className="modal-title mb-0">{titulo}</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{mensagem}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
