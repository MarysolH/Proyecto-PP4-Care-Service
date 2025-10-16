import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.jpg"; 
import "./Header.css";


function Header({ username = "Admin" }) {
  const navigate = useNavigate();
  const initial = username.charAt(0).toUpperCase();  

  const handleLogout = () => {
    // Aquí se van a limpiar datos de sesión 
    navigate("/"); // redirige al login
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo Care Service" className="logo" />
        
      </div>

      <div className="header-right">
        <div className="user-circle">{initial}</div>
        <span className="username">{username}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;