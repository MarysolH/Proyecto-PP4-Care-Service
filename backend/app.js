import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuariosRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/usuarios", usuariosRoutes);

// --- Conexión a Mongo Atlas ---
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
  .then(() => console.log("Mongo Atlas conectado"))
  .catch(err => console.error("Error al conectar Mongo Atlas:", err));

export default app;

