import mongoose from "mongoose";

const EstacionSchema = new mongoose.Schema(
  {
    numero: { type: Number, required: true, unique: true }, // 1–5
    mecanico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Estacion", EstacionSchema);
