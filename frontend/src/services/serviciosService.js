import { API_URL } from "../config";

// Obtener todos los servicios
export const getServicios = async () => {
  try {
    const res = await fetch(`${API_URL}/servicios`);
    if (!res.ok) throw new Error("Error al obtener servicios");
    return await res.json();
  } catch (error) {
    console.error("getServicios:", error);
    return [];
  }
};

// Crear un servicio nuevo
export const createServicio = async (data) => {
  try {
    const res = await fetch(`${API_URL}/servicios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al crear servicio");
    return await res.json();
  } catch (error) {
    console.error("createServicio:", error);
    throw error;
  }
};

// Actualizar un servicio existente
export const updateServicio = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al actualizar servicio");
    return await res.json();
  } catch (error) {
    console.error("updateServicio:", error);
    throw error;
  }
};

// Eliminar un servicio
export const deleteServicio = async (id) => {
  try {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar servicio");
    return await res.json();
  } catch (error) {
    console.error("deleteServicio:", error);
    throw error;
  }
};
