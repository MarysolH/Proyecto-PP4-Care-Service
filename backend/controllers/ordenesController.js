import Orden from "../models/Orden.js";

// Obtener todas las órdenes
export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await Orden.find();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener órdenes", error });
  }
};

// Crear una nueva orden
export const createOrden = async (req, res) => {
  try {   
    const nuevaOrden = new Orden(req.body);
    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);
  } catch (error) {
    res.status(400).json({ message: "Error al crear orden", error });
  }
};

// Actualizar una orden existente
export const updateOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const ordenActualizada = await Orden.findByIdAndUpdate(id, req.body, { new: true });
    res.json(ordenActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar orden", error });
  }
};

// Eliminar una orden
export const deleteOrden = async (req, res) => {
  try {
    const { id } = req.params;
    await Orden.findByIdAndDelete(id);
    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar orden", error });
  }
};

// PUT /api/ordenes/:id/estado -> solo mecánico
export const actualizarEstadoOrden = async (req, res) => {
  if (req.user.rol !== "mecanico") {
    return res.status(403).json({ message: "No autorizado" });
  }

  const orden = await Orden.findById(req.params.id);
  if (!orden) return res.status(404).json({ message: "Orden no encontrada" });

  orden.estado = req.body.estado;
  await orden.save();
  res.json(orden);
};