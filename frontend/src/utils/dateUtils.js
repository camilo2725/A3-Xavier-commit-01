export const parseDiaMesAno = (dataStr) => {
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dataRegex.test(dataStr)) return null;

    const [dia, mes, ano] = dataStr.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes - 1 ||
        data.getDate() !== dia
    ) {
        return null; // Data inválida
    }

    return data;
};
