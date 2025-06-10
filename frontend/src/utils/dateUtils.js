export const parseDiaMesAno = (dataStr) => {
    if (!dataStr) return null;

    try {
        const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (dataRegex.test(dataStr)) {
            const [dia, mes, ano] = dataStr.split('/').map(Number);
            const data = new Date(ano, mes - 1, dia);
            if (
                data.getFullYear() === ano &&
                data.getMonth() === mes - 1 &&
                data.getDate() === dia
            ) {
                return data;
            }
        }
        return null;
    } catch (error) {
        console.error('Erro ao parsear data:', error);
        return null;
    }
};
export const formatarDataISO = (data) => {
    if (!data) return '';
    const dataObj = new Date(data);

    const dataCorrigida = new Date(dataObj.valueOf() + dataObj.getTimezoneOffset() * 60000);

    const ano = dataCorrigida.getFullYear();
    const mes = String(dataCorrigida.getMonth() + 1).padStart(2, '0');
    const dia = String(dataCorrigida.getDate()).padStart(2, '0');

    return `${ano}/${mes}/${dia}`;
};

export const formatarHora = (hora) => {
    if (!hora || typeof hora !== 'string') return '';

    return hora.substring(0, 5);
};

export const formatarDataBrasileira = (dataStr) => {
    if (!dataStr) return '';


    if (dataStr.includes('/')) {
        const [ano, mes, dia] = dataStr.split('/');
        return `${dia}/${mes}/${ano}`;
    }

    return dataStr;
};