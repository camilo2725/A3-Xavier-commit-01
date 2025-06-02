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
        return null;
    }

    return data;
};


// Formata uma data ISO para "dd/mm/aaaa"
export const formatarDataISO = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR'); // ex: "10/10/2025"
};

// Formata hora no formato "HH:MM"
export const formatarHora = (hora) => {
    if (!hora) return '--:--';
    return hora.slice(0, 5); // "14:30" se for "14:30:00"
};
