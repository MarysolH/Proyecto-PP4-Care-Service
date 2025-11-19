import { API_URL } from "../config";

// Obtener todas las órdenes
export const getOrdenes = async () => {
  try {
    const res = await fetch(`${API_URL}/ordenes`);
    if (!res.ok) throw new Error("Error al obtener órdenes");
    return await res.json();
  } catch (error) {
    console.error("Error en getOrdenes:", error);
    return [];
  }
};

// Obtener detalle de una orden
export const getOrdenById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/ordenes/${id}`);
    if (!res.ok) throw new Error("Error al obtener detalle de orden");
    return await res.json();
  } catch (error) {
    console.error("Error en getOrdenById:", error);
    return null;
  }
};

// Crear nueva orden
export const createOrden = async (ordenData) => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData?.accessToken;

    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${API_URL}/ordenes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(ordenData),
    });

    console.log("Enviando orden:", ordenData);
    console.log("Respuesta del servidor:", res);

    if (!res.ok) {
      const text = await res.text();
      console.error("Error al crear orden:", text);
      throw new Error("Error al crear orden");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en createOrden:", error);
    return null;
  }
};

// Actualizar una orden existente
export const actualizarOrden = async (id, ordenData) => {
  console.log("ID recibido en servicio:", id);
  console.log("Datos a actualizar:", ordenData);

  if (!id || typeof id !== "string") {
    console.error("ID inválido:", id);
    return null;
  }

  if (!ordenData || typeof ordenData !== "object") {
    console.error("Datos de orden inválidos:", ordenData);
    return null;
  }

  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token || userData?.accessToken;

    if (!token) throw new Error("No autorizado");

    const res = await fetch(`${API_URL}/ordenes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(ordenData),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error al actualizar orden:", text);
      throw new Error("Error al actualizar orden");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en actualizarOrden:", error);
    return null;
  }
};


