import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/Car";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(async () => {
    console.log("Conectado ao MongoDB. Populando dados...");

    // Apagar dados existentes
    await Car.deleteMany();

    // Adicionar carros
    const cars = [
      { name: "Ford Mustang", brand: "Ford", year: 2019, engine: "5.0L V8", startingPrice: 50000, currentPrice: 50000 },
      { name: "Chevrolet Camaro", brand: "Chevrolet", year: 2020, engine: "6.2L V8", startingPrice: 55000, currentPrice: 55000 },
      { name: "Porsche 911", brand: "Porsche", year: 2021, engine: "3.0L Turbo", startingPrice: 100000, currentPrice: 100000 }
    ];

    await Car.insertMany(cars);
    console.log("Dados populados com sucesso!");

    mongoose.disconnect();
  })
  .catch((err) => console.error("Erro ao popular dados:", err));
