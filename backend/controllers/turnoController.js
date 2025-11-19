import Turno from "../models/Turno.js";

// Obtener todos los turnos
export const getTurnos = async (req, res) => {
  try {
    const turnos = await Turno.find();
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener turnos", error });
  }
};

// Crear nuevo turno
export const createTurno = async (req, res) => {
  console.log("Datos recibidos:", req.body); // esto es clave para ver qué llega

  try {
    const nuevoTurno = new Turno(req.body);
    const saved = await nuevoTurno.save();
    console.log("Turno guardado correctamente:", saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error al guardar turno:", error); // esto muestra el error real
    res.status(400).json({ message: "Error al crear turno", error });
  }
};

// Actualizar un turno por ID
export const updateTurno = async (req, res) => {
  const { id } = req.params;
  console.log("Actualizando turno ID:", id, "con datos:", req.body);

  try {
    const turnoActualizado = await Turno.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!turnoActualizado) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    res.json(turnoActualizado);
  } catch (error) {
    console.error("Error al actualizar turno:", error);
    res.status(400).json({ message: "Error al actualizar turno", error });
  }
};

// Eliminar un turno por ID
export const deleteTurno = async (req, res) => {
  const { id } = req.params;
  console.log("Eliminando turno ID:", id);

  try {
    const eliminado = await Turno.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    res.json({ message: "Turno eliminado correctamente", turno: eliminado });
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    res.status(400).json({ message: "Error al eliminar turno", error });
  }
};