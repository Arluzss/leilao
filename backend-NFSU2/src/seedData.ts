import mongoose from "mongoose";
import dotenv from "dotenv";
import CarCollection from "./models/Car";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(async () => {
    console.log("Conectado ao MongoDB. Populando dados...");

    // Apagar dados existentes
    await CarCollection.deleteMany();

    // Dados organizados por categorias
    const carsData = {
      categorias: [
        {
          popular: [
            {
              id: 1,
              nome: "GOLF CONFORTLINE",
              marca: "Volkswagen",
              preco: 50000,
              imagem: "gol.jpg",
              bids: [{ user: "João", bidAmount: 50500 }],
              comments: [{ user: "Maria", text: "Ótimo carro!" }]
            },
            {
              id: 2,
              nome: "Onix",
              marca: "Chevrolet",
              preco: 60000,
              imagem: "onix.jpg",
              bids: [{ user: "Carlos", bidAmount: 61000 }],
              comments: [{ user: "Ana", text: "Muito econômico!" }]
            },
            {
              id: 3,
              nome: "Fiesta",
              marca: "Ford",
              preco: 55000,
              imagem: "fiesta.jpg",
              bids: [{ user: "Pedro", bidAmount: 56000 }],
              comments: [{ user: "Clara", text: "Bom custo-benefício." }]
            }
          ],
          luxo: [
            {
              id: 4,
              nome: "Civic",
              marca: "Honda",
              preco: 100000,
              imagem: "civic.jpg",
              bids: [{ user: "Ricardo", bidAmount: 102000 }],
              comments: [{ user: "Fernanda", text: "Excelente conforto." }]
            },
            {
              id: 5,
              nome: "Corolla",
              marca: "Toyota",
              preco: 110000,
              imagem: "corolla.jpg",
              bids: [{ user: "Lucas", bidAmount: 112000 }],
              comments: [{ user: "Juliana", text: "Dirigibilidade incrível!" }]
            },
            {
              id: 6,
              nome: "Accord",
              marca: "Honda",
              preco: 120000,
              imagem: "accord.jpg",
              bids: [{ user: "Marcos", bidAmount: 122000 }],
              comments: [{ user: "Sofia", text: "Luxo e potência." }]
            }
          ]
        }
      ]
    };

    // Inserir os dados no MongoDB
    await CarCollection.create(carsData);
    console.log("Dados populados com sucesso!");

    mongoose.disconnect();
  })
  .catch((err) => console.error("Erro ao popular dados:", err));
