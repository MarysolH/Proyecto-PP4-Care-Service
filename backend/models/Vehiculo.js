import mongoose from "mongoose";

// Subdocumento para los modelos
const ModeloSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  variantes: [String],
  años: [Number],
});

// Esquema principal de vehículo
const VehiculoSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelos: [ModeloSchema],
  otros: { type: String } // para casos excepcionales o marcas no detalladas
}, { timestamps: true });

export default mongoose.model("Vehiculo", VehiculoSchema);

