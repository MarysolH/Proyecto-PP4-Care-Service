import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Conectado a MongoDB");

    const serviciosCollection = mongoose.connection.db.collection("servicios");

    const servicios = [
      { nombre: "Cambio aceite y filtros", precio: 85000 },
      { nombre: "Frenos", precio: 120000 },
      { nombre: "Revisión general", precio: 95000 }
    ];

    const result = await serviciosCollection.insertMany(servicios);
    console.log("Servicios insertados:", result.insertedCount);

    process.exit(0);
  })
  .catch((err) => {
    console.error("Error al conectar:", err);
  });
