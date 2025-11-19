import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB");

    // Listar las colecciones existentes
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Colecciones en la DB:", collections.map(c => c.name));

    process.exit(0);
  })
  .catch((err) => {
    console.error("Error al conectar:", err);
  });
