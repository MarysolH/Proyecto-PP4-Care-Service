import Servicio from "../models/Servicio.js";

// Obtener todos los servicios
export const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    // console.log("Servicios desde MongoDB:", servicios);
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener servicios", error });
  }
};

// Crear un nuevo servicio
export const createServicio = async (req, res) => {
  try {
    const nuevoServicio = new Servicio(req.body);
    const saved = await nuevoServicio.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error al crear servicio", error });
  }
};

// Actualizar un servicio por ID
export const updateServicio = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Servicio.findByIdAndUpdate(id, req.body, { new: true,
    runValidators: true 
  });
    if (!updated) return res.status(404).json({ message: "Servicio no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar servicio", error });
  }
};

// Eliminar un servicio por ID
export const deleteServicio = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Servicio.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Servicio no encontrado" });
    res.json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar servicio", error });
  }
};
