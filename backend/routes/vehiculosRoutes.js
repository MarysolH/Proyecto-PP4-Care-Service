import express from "express";
import { 
  getVehiculos, 
  createVehiculo, 
  updateVehiculo, 
  deleteVehiculo 
} from "../controllers/vehiculosController.js";

const router = express.Router();

// Obtener todas las marcas y modelos
router.get("/", getVehiculos);

// Crear una nueva marca o agregar modelos
router.post("/", createVehiculo);

// Actualizar un vehículo por ID
router.put("/:id", updateVehiculo);

// Eliminar un vehículo por ID
router.delete("/:id", deleteVehiculo);

export default router;

