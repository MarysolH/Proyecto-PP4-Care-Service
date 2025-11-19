// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware para proteger rutas según token y rol.
 * @param {Array} rolesPermitidos - Ej: ["administrativo", "mecanico"]
 */
export const protect = (rolesPermitidos = []) => async (req, res, next) => {
  let token;

  // Verificar encabezado con token tipo "Bearer ..."
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuario y excluir la contraseña
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      // Verificar rol permitido (si se especificó)
      if (rolesPermitidos.length && !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      next(); // pasa al siguiente middleware o controlador
    } catch (error) {
      console.error("Error en autenticación:", error);
      res.status(401).json({ message: "Token inválido o expirado" });
    }
  } else {
    res.status(401).json({ message: "No autorizado, token no enviado" });
  }
};

