import mongoose from "mongoose";

const ordenSchema = new mongoose.Schema({
  turnoNumero: { type: String, required: true },
  
  cliente: {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String },
  },

  vehiculo: {
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    anio: { type: Number },
    patente: { type: String },
  },

  servicio: { type: String },

  estado: { type: String, default: "PENDIENTE" }, // PENDIENTE | EN CURSO | FINALIZADO

  horaIngreso: { type: String },
  estacion: { type: String },
  comentarios: { type: String },

  
  servicioRealizado: { type: Boolean },

  serviciosAdicionales: [
    {
      nombre: { type: String },
      realizado: { type: Boolean },
    }
  ],

  puntosControl: [
    {
      nombre: { type: String },
      realizado: { type: Boolean },
    }
  ],

  fechaTurno: { type: String },
  fechaIngreso: { type: String },

}, { timestamps: true });

export default mongoose.model("Orden", ordenSchema);
