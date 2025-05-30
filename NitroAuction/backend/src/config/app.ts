import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import carRoutes from "../modules/car/car.controller";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/cars", carRoutes);

export default app;