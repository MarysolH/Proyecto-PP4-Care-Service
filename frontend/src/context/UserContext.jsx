import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

console.log("UserContext cargado ");

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 🔹 Guarda en localStorage cuando cambia el usuario (por ejemplo, después de login)
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (usuario, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { usuario, password });
      const data = res.data;
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      
      return { success: true, data };
    } catch (error) {
      console.error("Error login:", error.response?.data || error.message);
      return { success: false, error: "Error al loguear usuario" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

