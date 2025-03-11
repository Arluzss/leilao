import express, { Request, Response } from "express";
import Car from "../models/Car";
import path from 'path';
import fs from 'fs';

const router = express.Router();

interface Client {
  send(arg0: string): unknown;
  id: string;
  response: Response;
}

let clients: Client[] = [];

router.get('/notification/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;

  // Check if the client already exists
  const existingClient = clients.find(client => client.id === userId);
  if (existingClient) {
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const client = {
    id: userId,
    response: res,
    send: (message: string) => res.write(`data: ${message}\n\n`)
  };
  console.log('Cliente conectado');
  clients.push(client);

  req.on('close', () => {
    clients = clients.filter(c => c.id !== userId);
    console.log('Cliente desconectado');
  });
});


export { clients };

// Rota para criar um novo carro
router.post("/", async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar o carro", details: err });
  }
});

router.get("/logo", async (req, res) => {
  const logoPath = path.join(__dirname, '../../public/images/logo/volkswagenLogo.png');

  if (fs.existsSync(logoPath)) {
    res.sendFile(logoPath);
  } else {
    res.status(404).json({ error: "Logo não encontrada" });
  }
});

router.get("/carImage", async (req, res) => {
  const carImagePath = path.join(__dirname, '../../public/images/cars/Golf.png');

  if (fs.existsSync(carImagePath
  )) {
    res.sendFile
      (carImagePath);
  } else {
    res.status(404).json({ error: "Imagem do carro não encontrada" });
  }
});
//encontra o carro pelo id
router.get("/:category/:id", async (req: any, res: any) => {
  try {
    const { category, id } = req.params;
    const carId = Number(id);

    const carCollection = await Car.findOne({});

    if (!carCollection) {
      return res.status(404).json({ message: "Nenhuma coleção encontrada." });
    }

    const categoriaEncontrada = carCollection.categorias.find((cat: Record<string, any>) => cat[category]);
    if (!categoriaEncontrada) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }
    const car = categoriaEncontrada[category as keyof typeof categoriaEncontrada].find((car: Record<string, any>) => car.id === carId);
    console.log(car);
    if (!car) {
      return res.status(404).json({ message: "Carro não encontrado." });
    }

    res.json(car);

  } catch (err) {
    res.status(500).json({ error: "Erro ao encontrar o carro", details: err });
  }
});

// Rota para listar todos os carros
router.get("/", async (req, res) => {
  console.log("GET /cars");
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os carros", details: err });
  }
});

// Rota para atualizar um carro pelo ID
router.put("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }
    return res.json(updatedCar);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar o carro", details: err });
  }
});


// Rota para deletar um carro pelo ID
router.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const deletedCar = await Car.findByIdAndDelete(id);

    if (!deletedCar) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }

    res.json({ message: "Carro deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar o carro", details: err });
  }
});

// Rota para buscar carros por categoria
router.get("/:category", async (req: any, res: any) => {
  try {
    const { category } = req.params;

    const carCollection = await Car.findOne({});
    if (!carCollection) {
      return res.status(404).json({ message: "Nenhuma coleção encontrada." });
    }

    const categoriaEncontrada = carCollection.categorias.find((cat: Record<string, any>) => cat[category]);

    if (!categoriaEncontrada) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    res.json(categoriaEncontrada[category as keyof typeof categoriaEncontrada]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os carros." });
  }
});

router.post("/:category/:id/comment", async (req: any, res: any) => {
  try {
    const { category, id } = req.params;
    const carId = Number(id);

    const carCollection = await Car.findOne({});

    if (!carCollection) {
      return res.status(404).json({ message: "Nenhuma coleção encontrada." });
    }

    const categoriaEncontrada = carCollection.categorias.find((cat: Record<string, any>) => cat[category]);
    if (!categoriaEncontrada) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }
    const car = categoriaEncontrada[category as keyof typeof categoriaEncontrada].find((car: Record<string, any>) => car.id === carId);
    if (!car) {
      return res.status(404).json({ message: "Carro não encontrado." });
    }
    car.comments.push(req.body);
    await carCollection.save();
    res.status(200).json({ info: "Comentário adicionado com sucesso" });

  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar comentário ao carro", details: err });
  }
});

router.get("/:category/:id/comment", async (req: any, res: any) => {
  try {
    const { category, id } = req.params;
    const carId = Number(id);

    const carCollection = await Car.findOne({});

    if (!carCollection) {
      return res.status(404).json({ message: "Nenhuma coleção encontrada." });
    }

    const categoriaEncontrada = carCollection.categorias.find((cat: Record<string, any>) => cat[category]);
    if (!categoriaEncontrada) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }
    const car = categoriaEncontrada[category as keyof typeof categoriaEncontrada].find((car: Record<string, any>) => car.id === carId);
    if (!car) {
      return res.status(404).json({ message: "Carro não encontrado." });
    }
    console.log(car.comments);
    res.json(car.comments);

  } catch (err) {
    res.status(500).json({ error: "Erro ao encontrar os comentários do carro", details: err });
  }
});

export default router;
