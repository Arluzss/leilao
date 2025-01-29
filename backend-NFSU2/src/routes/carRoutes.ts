import express from "express";
import Car from "../models/Car";

const router = express.Router();

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

// Rota para listar todos os carros
router.get("/", async (req, res) => {
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

export default router;
