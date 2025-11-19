import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { protect } from "./middlewares/authMiddleware.js";

// Importar rutas
import authRoutes from "./routes/authRoutes.js";
import turnoRoutes from "./routes/turnosRoutes.js";
import vehiculosRoutes from "./routes/vehiculosRoutes.js";
import serviciosRoutes from "./routes/serviciosRoutes.js";
import ordenesRoutes from "./routes/ordenesRoutes.js";
import estacionRoutes from "./routes/estacionRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";


dotenv.config();

const app = express();

// ======== Middlewares ========
app.use(cors());
app.use(express.json());

// ======== Conexión a MongoDB ========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    console.log("Base activa:", mongoose.connection.name);
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// ======== Rutas públicas ========
// Registro y login
app.use("/api/auth", authRoutes);

// ======== Rutas protegidas ========
// Por el momento admin1 accede a todo

// 🔹 Administrativo
app.use("/api/turnos", turnoRoutes);
app.use("/api/ordenes", ordenesRoutes);
app.use("/api/usuarios", usuariosRoutes);

// 🔹 Mecánico
app.use("/api/orden-taller", ordenesRoutes);

// 🔹 Rutas generales sin restricción
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/estaciones", estacionRoutes);


// ======== Ruta de prueba ========
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// ======== Inicio del servidor ========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT}`)
);
