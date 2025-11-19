import axios from "axios";
import { API_URL } from "../config";

const ESTACIONES_URL = `${API_URL}/estaciones`;

// Obtener todas las estaciones
export const getEstaciones = async () => {
  try {
    const res = await axios.get(ESTACIONES_URL);
    return res.data;
  } catch (error) {
    console.error("Error al obtener estaciones:", error);
    throw error;
  }
};

// Crear nueva estación
export const createEstacion = async (data) => {
  try {
    const res = await axios.post(ESTACIONES_URL, data);
    return res.data;
  } catch (error) {
    console.error("Error al crear estación:", error);
    throw error;
  }
};

// Actualizar estación
export const updateEstacion = async (id, data) => {
  try {
    const res = await axios.put(`${ESTACIONES_URL}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar estación:", error);
    throw error;
  }
};

// Eliminar estación
export const deleteEstacion = async (id) => {
  try {
    const res = await axios.delete(`${ESTACIONES_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar estación:", error);
    throw error;
  }
};
