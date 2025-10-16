import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate(); // Hook para redirigir

  const handleLogin = (e) => {
    e.preventDefault(); 
    // Aquí se agregara validación real más adelante

    navigate("/dashboard"); // redirige al Dashboard
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Iniciar Sesión</h1>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Usuario" 
            className="login-input"
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="login-input" 
            required
          />
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
