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
              name: "Golf Confortline",
              brand: "Volkswagen",
              year: 2019,
              price: 50000,
              km: 10000,
              engine: "1.4 TSI",
              logoSrc: "http://localhost:3000/cars/logo",
              carSrc: "http://localhost:3000/cars/CarImage",
              bids: [
                { user: "João", bidAmount: 50500 },
                { user: "Ana", bidAmount: 51000 }
              ],
              parts: [
                { name: "Motor", rating: 8 },
                { name: "Freios", rating: 7 },
                { name: "Suspensão", rating: 8 },
                { name: "Interior", rating: 8 },
                { name: "Estrutura", rating: 7 },
                { name: "Pintura", rating: 8 }
              ],
              comments: [
                { user: "Maria", text: "Ótimo carro!" },
                { user: "Carlos", text: "Muito econômico." }
              ]
            },
            {
              id: 2,
              name: "Fiesta SE",
              brand: "Ford",
              year: 2018,
              price: 40000,
              km: 12000,
              engine: "1.6 Flex",
              logoSrc: "ford.png",
              carSrc: "fiesta.jpg",
              bids: [
                { user: "Lucas", bidAmount: 40500 }
              ],
              parts: [
                { name: "Motor", rating: 7 },
                { name: "Freios", rating: 8 },
                { name: "Suspensão", rating: 7 },
                { name: "Interior", rating: 7 },
                { name: "Estrutura", rating: 7 },
                { name: "Pintura", rating: 7 }
              ],
              comments: [
                { user: "Beatriz", text: "Ótimo custo-benefício." }
              ]
            }
          ],
          luxo: [
            {
              id: 3,
              name: "Civic Touring",
              brand: "Honda",
              year: 2022,
              price: 150000,
              logoSrc: "honda.png",
              km: 5000,
              engine: "1.5 Turbo",
              carSrc: "civic.jpg",
              bids: [
                { user: "Ricardo", bidAmount: 152000 },
                { user: "Fernanda", bidAmount: 153500 }
              ],
              parts: [
                { name: "Motor", rating: 9 },
                { name: "Freios", rating: 9 },
                { name: "Suspensão", rating: 9 },
                { name: "Interior", rating: 9 },
                { name: "Estrutura", rating: 9 },
                { name: "Pintura", rating: 9 }
              ],
              comments: [
                { user: "Fernanda", text: "Excelente conforto." },
                { user: "Eduardo", text: "Dirigibilidade incrível." }
              ]
            },
            {
              id: 4,
              name: "BMW 320i",
              brand: "BMW",
              year: 2021,
              price: 200000,
              logoSrc: "bmw.png",
              km: 8000,
              engine: "2.0 Turbo",
              carSrc: "bmw320i.jpg",
              bids: [
                { user: "Marcos", bidAmount: 202500 }
              ],
              parts: [
                { name: "Motor", rating: 10 },
                { name: "Freios", rating: 9 },
                { name: "Suspensão", rating: 9 },
                { name: "Interior", rating: 10 },
                { name: "Estrutura", rating: 9 },
                { name: "Pintura", rating: 9 }
              ],
              comments: [
                { user: "Roberta", text: "Luxo e potência!" }
              ]
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
