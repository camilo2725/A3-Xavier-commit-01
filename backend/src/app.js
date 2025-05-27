import express from "express";
import cors from "cors";
import helmet from "helmet";
import garcomRoutes from './routes/garcomRoutes';
import gerenteRoutes from './routes/gerenteRoutes.js';


const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());

app.use('/api', garcomRoutes);
app.use('/gerente', gerenteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);

});

export default new App().app;