import mongoose from "mongoose";

const ServicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  precio: { type: Number, required: true },
  
}, { timestamps: true });

export default mongoose.model("Servicio", ServicioSchema);
