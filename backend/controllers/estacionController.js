import Estacion from "../models/Estacion.js";

// Obtener estaciones
export const getEstaciones = async (req, res) => {
  try {
    let estaciones = await Estacion.find().populate("mecanico");

    // Si faltan estaciones, las creamos
    if (estaciones.length < 5) {
      const existentes = estaciones.map(e => e.numero);

      for (let i = 1; i <= 5; i++) {
        if (!existentes.includes(i)) {
          await Estacion.create({ numero: i });
        }
      }

      // Volver a cargar después de crear las faltantes
      estaciones = await Estacion.find().populate("mecanico");
    }

    res.json(estaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estaciones", error });
  }
};

// Crear estación (solo para inicializar)
export const createEstacion = async (req, res) => {
  try {
    const nueva = new Estacion(req.body);
    const saved = await nueva.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error al crear estación", error });
  }
};

// Asignar o actualizar mecánico
export const updateEstacion = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Estacion.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate("mecanico");

    if (!updated)
      return res.status(404).json({ message: "Estación no encontrada" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar estación", error });
  }
};

// Eliminar estación 
export const deleteEstacion = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Estacion.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Estación no encontrada" });
    res.json({ message: "Estación eliminada correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar estación", error });
  }
};
