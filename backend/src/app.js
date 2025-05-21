import garcomRoutes from "./routes/garcomRoutes";
import express from "express";
import cors from "cors";    
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());

app.use('/api', garcomRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);

});

export default new App().app;