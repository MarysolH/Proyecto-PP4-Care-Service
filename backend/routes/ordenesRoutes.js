import express from "express";
import {
  getOrdenes,
  createOrden,
  updateOrden,
  deleteOrden,
} from "../controllers/ordenesController.js";

const router = express.Router();

router.get("/", getOrdenes);
router.post("/", createOrden);
router.put("/:id", updateOrden);
router.delete("/:id", deleteOrden);

export default router;
