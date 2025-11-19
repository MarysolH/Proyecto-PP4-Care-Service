import { API_URL } from "../config";

// Helper para crear headers con token
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Obtener turnos
export const getTurnos = async () => {
  try {
    const res = await fetch(`${API_URL}/turnos`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Error al obtener turnos");
    return res.json();
  } catch (error) {
    console.error("⚠️ Error en getTurnos:", error);
    throw error;
  }
};

// Crear turno
export async function createTurno(turnoData) {
  try {
    const response = await fetch(`${API_URL}/turnos`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(turnoData),
    });

    const data = await response.json().catch(() => ({})); // evita error si el body está vacío

    if (!response.ok) {
      console.error("❌ Error del servidor:", data);
      throw new Error(data.message || "Ocurrió un error al guardar el turno");
    }

    console.log("✅ Turno creado correctamente:", data);
    return data;
  } catch (error) {
    console.error("⚠️ Error en createTurno:", error);
    throw error;
  }
}

// Actualizar turno
export const updateTurno = async (id, turnoData) => {
  try {
    const res = await fetch(`${API_URL}/turnos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(turnoData),
    });

    if (!res.ok) throw new Error("Error al actualizar turno");
    return await res.json();
  } catch (error) {
    console.error("⚠️ Error en updateTurno:", error);
    return null;
  }
};

// Eliminar turno
export const deleteTurno = async (id) => {
  try {
    const res = await fetch(`${API_URL}/turnos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Error al eliminar turno");
    return res.json();
  } catch (error) {
    console.error("⚠️ Error en deleteTurno:", error);
    return null;
  }
};

// Cancelar turno (actualiza estado)
export const cancelarTurno = async (id) => {
  try {
    const res = await fetch(`${API_URL}/turnos/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado: "Cancelado" }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) throw new Error(`Error del servidor (${res.status})`);
    return data;
  } catch (error) {
    console.error("⚠️ Error en cancelarTurno:", error);
    return null;
  }
};


