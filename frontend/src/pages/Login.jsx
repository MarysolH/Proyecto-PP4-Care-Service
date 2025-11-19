import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import "../styles/Login.css";

export default function Login() {
  const { login } = useContext(UserContext);
  const [modo, setModo] = useState("login"); // login | registro | cambiar
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [rol, setRol] = useState("administrativo");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [tempPassword, setTempPassword] = useState(""); // contraseña temporal
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const mostrarMensaje = (texto, tipo = "exito") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(""), 4000);
  };

  // LOGIN NORMAL
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(usuario, password);
    if (!res.success) return mostrarMensaje(res.error, "error");

    mostrarMensaje(`Bienvenido ${res.data.usuario}`);
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  // REGISTRO
  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        usuario,
        nombre,
        password,
        rol,
      });
      mostrarMensaje("Usuario registrado correctamente");
      setModo("login");
    } catch (err) {
      mostrarMensaje("Error al registrar usuario", "error");
    }
  };

  // CAMBIO DE CONTRASEÑA
  const handleCambio = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/auth/change-password", {
        usuario,
        oldPassword: password,
        newPassword: nuevoPassword,
      });
      mostrarMensaje("Contraseña actualizada correctamente");
      setModo("login");
    } catch (err) {
      mostrarMensaje("Error al cambiar contraseña", "error");
    }
  };

  // OLVIDO CONTRASEÑA 
  const handleOlvido = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", { usuario });
      setTempPassword(res.data.tempPassword);
      mostrarMensaje("Contraseña temporal generada");
    } catch (err) {
      mostrarMensaje("Error al generar contraseña temporal", "error");
    }
  };

  return (
    <div className="login-container">
      {mensaje && (
        <div
          className={`mensaje-flotante unificado ${
            tipoMensaje === "exito" ? "exito" : "error"
          }`}
        >
          {mensaje}
        </div>
      )}

      <div className="login-box">
        <h2 className="login-title">
          {modo === "login"
            ? "Iniciar Sesión"
            : modo === "registro"
            ? "Registrar Usuario"
            : modo === "cambiar"
            ? "Cambiar Contraseña"
            : "Recuperar Contraseña"}
        </h2>

        {modo !== "olvido" && (
        <form
          onSubmit={
            modo === "login"
              ? handleLogin
              : modo === "registro"
              ? handleRegistro
              : handleCambio
          }
        >
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="login-input"
            required
          />

          {modo === "registro" && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="login-input"
            />
          )}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          {modo === "registro" && (
            <>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="login-input"
              >
                <option value="administrativo">Administrativo</option>
                <option value="mecanico">Mecánico</option>
              </select>
            </>
          )}

          {modo === "cambiar" && (
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevoPassword}
              onChange={(e) => setNuevoPassword(e.target.value)}
              className="login-input"
            />
          )}

          <button type="submit" className="login-button">
            {modo === "login"
              ? "Ingresar"
              : modo === "registro"
              ? "Registrar"
              : "Actualizar"}
          </button>
        </form>
        )}

        {modo === "olvido" && (
          <form onSubmit={handleOlvido}>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-button">
              Generar contraseña temporal
            </button>
          </form>
        )}

        {tempPassword && (
          <div className="temp-password">
            Contraseña temporal: <strong>{tempPassword}</strong>
          </div>
        )}
        
        <div className="login-switch">
          {modo !== "login" && (
            <button onClick={() => setModo("login")} className="link-btn">
              ← Volver a Login
            </button>
          )}
          {modo === "login" && (
            <>
              <button onClick={() => setModo("registro")} className="link-btn">
                Crear cuenta
              </button>
              <button onClick={() => setModo("cambiar")} className="link-btn">
                Cambiar contraseña
              </button>
              <button onClick={() => setModo("olvido")} className="link-btn">
                Olvidé mi contraseña
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
