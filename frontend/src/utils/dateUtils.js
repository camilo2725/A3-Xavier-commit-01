export const parseDiaMesAno = (dataStr) => {
    if (!dataStr) return null;

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

    const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoRegex.test(dataStr)) {
        const data = new Date(dataStr);
        if (!isNaN(data.getTime())) {
            return data;
        }
    }


};


export const formatarDataISO = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR'); // ex: "10/10/2025"
};


export const formatarHora = (hora) => {
    if (!hora) return '--:--';
    return hora.slice(0, 5); // "14:30" se for "14:30:00"
};