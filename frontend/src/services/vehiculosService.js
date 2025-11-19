import { API_URL } from "../config";

export const getVehiculos = async () => {
  try {
    const res = await fetch(`${API_URL}/vehiculos`);
    if (!res.ok) throw new Error("Error al obtener vehículos");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
