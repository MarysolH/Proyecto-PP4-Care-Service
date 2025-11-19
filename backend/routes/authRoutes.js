import express from "express";
import { loginUser, registerUser, changePassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// Rutas de autenticación
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", changePassword);
router.post("/reset-password", resetPassword);

export default router;
