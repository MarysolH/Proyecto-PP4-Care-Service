import express from "express";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio
} from "../controllers/servicioController.js";

const router = express.Router();

// Obtener todos los servicios
router.get("/", getServicios);

// Crear un nuevo servicio
router.post("/", createServicio);

// Actualizar un servicio por ID
router.put("/:id", updateServicio);

// Eliminar un servicio por ID
router.delete("/:id", deleteServicio);

export default router;
