import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    apellido: { type: String, default: "" },
    nombre: { type: String, default: "" },
        
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    rol: { type: String, enum: ["administrativo", "mecanico"], required: true },

    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Hash de password antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
