export default function handleError(res, detail = "Erro interno", status = 500, message = "Erro") {
    console.error(`Erro: ${message} - Detalhe: ${detail}`);
    if (!res.headersSent) {
        return res.status(status).json({ message, detail });
    }
}
