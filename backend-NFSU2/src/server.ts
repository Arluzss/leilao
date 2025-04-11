import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import carRoutes from "./routes/carRoutes";
import "./services/webSocket.service";
import client from "../postgresDB";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/cars", carRoutes);

client.connect()
  .then(() => {
    console.log("✅ Conectado ao PostgreSQL! 🚀");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  }).catch((err) => {
    console.error("❌ Erro ao conectar ao PostgreSQL:", err);
  });

