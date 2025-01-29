import { Request, Response } from "express";
import Car from "../models/Car";

// Controlador para criar um novo carro
export const createCar = async (req: Request, res: Response) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar o carro", details: err });
  }
};

// Controlador para listar todos os carros
export const getAllCars = async (req: Request, res: Response) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os carros", details: err });
  }
};

// Controlador para atualizar um carro pelo ID
export const updateCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar o carro", details: err });
  }
};

// Controlador para deletar um carro pelo ID
export const deleteCarById = async (req: Request, res: Response) => {
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
};
