import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Registro de usuario
export const registerUser = async (req, res) => {
  const { apellido, nombre, usuario, password, rol } = req.body;

  try {
    const existeUsuario = await User.findOne({ usuario });
    if (existeUsuario) return res.status(400).json({ message: "Usuario ya existe" });

    const user = await User.create({ apellido, nombre, usuario, password, rol });
    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol,
        token: generarToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Datos inválidos" });
    }
  } catch (error) {

    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const user = await User.findOne({ usuario });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol,
        token: generarToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Usuario o password inválido" });
    }
  } catch (error) {

    console.error("Error al loguear usuario:", error);
    res.status(500).json({ message: "Error al loguear usuario", error });
  }
};

export const changePassword = async (req, res) => {
  const { usuario, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const passwordMatch = await user.matchPassword(oldPassword);
    if (!passwordMatch) return res.status(400).json({ message: "Contraseña actual incorrecta" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error al cambiar contraseña", error });
  }
};

export const resetPassword = async (req, res) => {
  const { usuario } = req.body;
  try {
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // Generar contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-4); // 4 caracteres
    user.password = await bcrypt.hash(tempPassword, 10);
    await user.save();

    res.json({ tempPassword });
  } catch (err) {
    res.status(500).json({ message: "Error al generar contraseña temporal" });
  }
};

