import express, { Request, Response } from "express";
import path from 'path';
import fs from 'fs';

import { getAllCars } from "./querys/postgresQuerys";
import { buildCarHateoasLinks } from "../services/car.service";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const cars = await getAllCars();
    if (!cars || cars.length === 0) {
      return;
    }
    res.json(buildCarHateoasLinks(cars));
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os carros", details: err });
  }
});

router.get("/images/:imageName", (req: Request, res: Response) => {

  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "../../public/images/cars", imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    res.sendFile(imagePath);
  });
});

router.get("/logo/:logoName", (req: Request, res: Response) => {

  const logoName = req.params.logoName;
  const logoPath = path.join(__dirname, "../../public/images/logo", logoName);

  fs.access(logoPath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "Logo não encontrada" });
    }
  });

  res.sendFile(logoPath);
});

export default router;
