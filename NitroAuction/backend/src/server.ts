import { createServer } from "http";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import app from "./config/app";

import "./modules/ws/webSocket.service";

async function startServer() {
  try {
    await connectDB();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");

    const server = createServer(app);

    const port = env.port || 3000;

    server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });

  }catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

startServer();

