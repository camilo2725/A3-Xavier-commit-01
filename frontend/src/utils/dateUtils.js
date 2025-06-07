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


}
export const formatarDataISO = (data) => {
    if (!data) return '';
    const dataObj = new Date(data);
    
    // Corrige o problema de fuso horário que pode mudar o dia
    const dataCorrigida = new Date(dataObj.valueOf() + dataObj.getTimezoneOffset() * 60000);

    const ano = dataCorrigida.getFullYear();
    const mes = String(dataCorrigida.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
    const dia = String(dataCorrigida.getDate()).padStart(2, '0');

    // Retorna a data no formato AAAA/MM/DD
    return `${ano}/${mes}/${dia}`;
};

export const formatarHora = (hora) => {
    if (!hora || typeof hora !== 'string') return '';
    // Pega apenas a parte da hora, ignorando os segundos
    return hora.substring(0, 5); // ex: "19:00:00" -> "19:00"
};