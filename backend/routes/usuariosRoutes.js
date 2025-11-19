import express from "express";
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  changeUserRole,
  toggleUsuarioActivo,
} from "../controllers/usuariosController.js";

const router = express.Router();

// Crear usuario
router.post("/", createUsuario);

// Obtener todos los usuarios
router.get("/", getUsuarios);

// Obtener un usuario específico
router.get("/:id", getUsuarioById);

// Actualizar datos del usuario (nombre, usuario, etc.)
router.put("/:id", updateUsuario);

// Cambiar solo el rol del usuario
router.put("/:id/rol", changeUserRole);

// Activar / desactivar usuario (soft delete)
router.put("/:id/toggle", toggleUsuarioActivo);

// Eliminar usuario definitivamente
router.delete("/:id", deleteUsuario);

export default router;
