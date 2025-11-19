import express from "express";
import {
  getEstaciones,
  createEstacion,
  updateEstacion,
  deleteEstacion
} from "../controllers/estacionController.js";

const router = express.Router();

router.get("/", getEstaciones);
router.post("/", createEstacion); // solo para inicializar estaciones 1–5
router.put("/:id", updateEstacion);
router.delete("/:id", deleteEstacion);

export default router;
