const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./routes/usuariosRoutes');
const reservaRoutes = require('./routes/reservasRoutes');

app.use('/api/usuario', usuarioRoutes);
app.use('/api/reservas', reservaRoutes);

app.post('/reservas', (req, res) => {
    const dados = req.body;
    console.log('Reserva recebida:', dados);
    res.status(201).json({ mensagem: 'Reserva criada com sucesso!', dados });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
