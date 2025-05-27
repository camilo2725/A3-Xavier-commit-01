const express = require('express');
const gerenteRoutes = require('./routes/gerente');


const app = express();
app.use(express.json());

// Rotas
app.use('/api/gerente', gerenteRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
