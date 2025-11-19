import mongoose from "mongoose";

const TurnoSchema = new mongoose.Schema({
  cliente: {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true }
  },
  vehiculo: {
    patente: { type: String, required: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    anio: { type: Number, required: true },
  },
  servicio: {
    type: String, // guardamos el nombre del servicio seleccionado
    required: true,
  },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  estacion: { type: String, required: true },
  observaciones: { type: String },
  estado: {
    type: String,
    enum: ["Disponible", "Reservado", "Cancelado", "Contingencia"],
    default: "Reservado",
  },
});

const Turno = mongoose.model("Turno", TurnoSchema);

export default Turno;


