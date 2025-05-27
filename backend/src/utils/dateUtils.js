export const parseDiaMesAno = (dataStr) => {
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(`${ano}-${mes}-${dia}`);
};
