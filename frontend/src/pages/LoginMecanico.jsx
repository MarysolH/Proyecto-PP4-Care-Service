import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginMecanico.css";

function LoginMecanico({ mecanico, onLogin, onClose }) {
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clave.length === 4) {
       navigate("/listado-ordenes", { state: { mecanico } });
    } else {
      alert("Clave incorrecta");
    }
  };

  return (
    <div className="login-mecanico-overlay">
      <div className="login-mecanico-card">
        <h2>{mecanico}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            maxLength={8}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Ingrese su clave"
            autoFocus
          />
          <div className="login-mecanico-buttons">
            <button type="submit">Entrar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginMecanico;
