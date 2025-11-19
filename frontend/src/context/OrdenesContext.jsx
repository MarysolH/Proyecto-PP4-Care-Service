import { createContext, useContext, useState } from "react";

const OrdenesContext = createContext();

export const useOrdenes = () => useContext(OrdenesContext);

export const OrdenesProvider = ({ children }) => {
  const [ordenes, setOrdenes] = useState([]);

  const actualizarOrden = (ordenActualizada) => {
    setOrdenes((prev) => {
      const existe = prev.find((o) => o._id === ordenActualizada._id);
      if (existe) {
        return prev.map((o) =>
          o._id === ordenActualizada._id ? { ...o, ...ordenActualizada } : o
        );
      } else {
        return [...prev, ordenActualizada];
      }
    });
  };

  return (
    <OrdenesContext.Provider value={{ ordenes, setOrdenes, actualizarOrden }}>
      {children}
    </OrdenesContext.Provider>
  );
};
