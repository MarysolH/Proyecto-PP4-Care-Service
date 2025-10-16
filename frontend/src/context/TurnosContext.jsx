import React, { createContext, useState, useContext } from "react";

// Creamos el contexto
const TurnosContext = createContext();

// Proveedor global de turnos
export const TurnosProvider = ({ children }) => {
  const [turnos, setTurnos] = useState([]); // Lista global de turnos

  return (
    <TurnosContext.Provider value={{ turnos, setTurnos }}>
      {children}
    </TurnosContext.Provider>
  );
};

// Custom hook para acceder fácil al contexto
export const useTurnos = () => useContext(TurnosContext);
