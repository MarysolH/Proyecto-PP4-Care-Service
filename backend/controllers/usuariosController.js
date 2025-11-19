import User from "../models/User.js";


// ======================================
// Crear nuevo usuario
// ======================================
export const createUsuario = async (req, res) => {
  const { apellido, nombre, usuario, password, rol } = req.body;

  try {
    // Validaciones básicas
    if (!apellido || !nombre || !usuario || !password || !rol) {
      return res
        .status(400)
        .json({ message: "Faltan datos obligatorios" });
    }

    // Verificar usuario duplicado
    const existe = await User.findOne({ usuario });
    if (existe) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está registrado" });
    }

    // Crear el usuario
    const nuevo = new User({
      apellido,
      nombre,
      usuario,
      password,
      rol,
    });

    await nuevo.save();

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        _id: nuevo._id,
        apellido: nuevo.apellido,
        nombre: nuevo.nombre,
        usuario: nuevo.usuario,
        rol: nuevo.rol,
        activo: nuevo.activo,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// ======================================
// Obtener todos los usuarios
// ======================================
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password"); // sin password
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ======================================
// Obtener usuario por ID
// ======================================
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select("-password");

    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// ======================================
// Actualizar datos básicos del usuario
// (nombre, usuario, etc)
// ======================================
export const updateUsuario = async (req, res) => {
  const { apellido, nombre, usuario } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (apellido !== undefined) user.apellido = apellido;
    if (nombre !== undefined) user.nombre = nombre;
    if (usuario !== undefined) user.usuario = usuario;

    const actualizado = await user.save();
    res.json({
      message: "Usuario actualizado",
      user: {
        _id: actualizado._id,
        apellido: actualizado.apellido,
        nombre: actualizado.nombre,
        usuario: actualizado.usuario,
        rol: actualizado.rol,
        activo: actualizado.activo,
      },
    });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// ======================================
// Cambiar rol de un usuario
// ======================================
export const changeUserRole = async (req, res) => {
  const { rol } = req.body;

  if (!rol)
    return res.status(400).json({ message: "Debe enviar un rol válido" });

  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.rol = rol;
    await user.save();

    res.json({ message: `Rol actualizado a: ${rol}` });

  } catch (error) {
    console.error("Error al cambiar rol:", error);
    res.status(500).json({ message: "Error al cambiar rol del usuario" });
  }
};

// ======================================
// Activar / desactivar usuario
// (soft delete)
// ======================================
export const toggleUsuarioActivo = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.activo = !user.activo;
    await user.save();

    res.json({
      message: `Usuario ${user.activo ? "activado" : "desactivado"}`
    });

  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    res.status(500).json({ message: "Error al cambiar estado del usuario" });
  }
};

// ======================================
// Eliminar usuario definitivamente
// ======================================
export const deleteUsuario = async (req, res) => {
  try {
    const eliminado = await User.findByIdAndDelete(req.params.id);

    if (!eliminado)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado definitivamente" });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
