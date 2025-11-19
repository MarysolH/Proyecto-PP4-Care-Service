import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UserContext } from "./UserContext"; 

export const TurnosContext = createContext();
// Hook de acceso
export const useTurnos = () => useContext(TurnosContext);

export const TurnosProvider = ({ children }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  // Trae los turnos desde el backend
  const fetchTurnos = useCallback(async () => {
    console.log("Solicitando turnos al backend...");
    setLoading(true);

    try {
      const headers = user?.token
        ? { Authorization: `Bearer ${user.token}` }
        : {};

      const res = await axios.get("http://localhost:5000/api/turnos", {
        headers,
      });

      console.log("Turnos cargados:", res.data);
      setTurnos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar turnos:", error.response?.data || error.message);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refrescar turnos desde cualquier parte de la app
  const refreshTurnos = useCallback(() => {
    console.log("🔁 Refrescando turnos...");
    fetchTurnos();
  }, [fetchTurnos]);

  // Recargar turnos cuando cambia el usuario
  useEffect(() => {
    if (user?.token) {
      fetchTurnos();
    }
  }, [user, fetchTurnos]);

  // Log de montaje/desmontaje
  useEffect(() => {
    console.log("TurnosProvider montado");
    return () => console.log("TurnosProvider desmontado");
  }, []);

return (
    <TurnosContext.Provider
      value={{
        turnos,
        setTurnos,
        fetchTurnos,
        refreshTurnos, 
        loading,
      }}
    >
      {children}
    </TurnosContext.Provider>
  );
};
