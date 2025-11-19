import Vehiculo from "../models/Vehiculo.js";

// Obtener todas las marcas y modelos
export const getVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vehículos", error });
  }
};

// Crear una nueva marca o agregar modelos
export const createVehiculo = async (req, res) => {
  try {
    const nuevoVehiculo = new Vehiculo(req.body);
    const saved = await nuevoVehiculo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error al crear vehículo", error });
  }
};

// Actualizar un vehículo por ID
export const updateVehiculo = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Vehiculo.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Vehículo no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar vehículo", error });
  }
};

// Eliminar un vehículo por ID
export const deleteVehiculo = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Vehiculo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Vehículo no encontrado" });
    res.json({ message: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar vehículo", error });
  }
};