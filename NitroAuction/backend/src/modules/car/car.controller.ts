import express, { Request, Response } from "express";
import { carService } from "./car.service";
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const cars = await carService.getAllCars();
    console.log(cars)
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os carros", details: err });
  }
});

router.delete("/remove/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await carService.removeCarByID(id);
    if (result) {
      res.status(200).json({ message: "Carro removido com sucesso" });
    } else {
      res.status(404).json({ error: "Carro não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover o carro", details: err });
  }
});

router.get("/find/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const car = await carService.findCarByID(id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ error: "Carro não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar o carro", details: err });
  }
});

router.get("/images/:imageName", (req: Request, res: Response) => {

  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "../../../public/images/cars", imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    console.log(err)
    if (err) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }
    res.sendFile(imagePath);
  });
});

router.get("/logo/:logoName", (req: Request, res: Response) => {

  const logoName = req.params.logoName;
  const logoPath = path.join(__dirname, "../../../public/images/logo", logoName);

  fs.access(logoPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "Logo não encontrada" });
    }
  });

  res.sendFile(logoPath);
});

export default router;
