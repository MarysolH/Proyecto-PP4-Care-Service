import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function PrivateRoute({ children, rolesPermitidos = [] }) {
  const { user } = useContext(UserContext);

  // Si no hay usuario logueado
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay rol y no coincide con los roles permitidos
  if (rolesPermitidos.length && !rolesPermitidos.includes(user.rol)) {
    return <Navigate to={user.rol === "administrativo" ? "/agenda" : "/taller"} replace />;
  }

  // Usuario logueado y rol permitido
  return children;
}
