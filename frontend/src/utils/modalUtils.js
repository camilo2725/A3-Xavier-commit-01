export const definirTipoModal = (mensagem) => {
    const erroDetectado = [
        'não pode',
        'discrepância',
        'obrigatória',
        'inválida',
        'encontrada',
        'precisa ser',
        'mínimo',
        'já está',
    ].some(termo => mensagem.toLowerCase().includes(termo));

    return erroDetectado ? 'erro' : 'sucesso';
};
