import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

import ConfigEstaciones from "./ConfigEstaciones";
import ConfigServicios from "./ConfigServicios";
import ConfigGeneral from "./ConfigGeneral";
import ConfigUsuarios from "./ConfigUsuarios";

import "../../styles/ConfiguracionTaller.css";



export default function ConfiguracionTaller() {
  const [tab, setTab] = useState("estaciones");

  return (
    <div className="config-taller-page">
      <Header username="Admin" />

      <div className="config-taller-container">
        <Sidebar />

        <main className="config-taller-main">
          <h1 className="config-taller-title">Configuración del Taller</h1>

          <div className="config-tabs">
            <button
              className={`tab-btn ${tab === "estaciones" ? "active" : ""}`}
              onClick={() => setTab("estaciones")}
            >
              Estaciones
            </button>
            <button
              className={`tab-btn ${tab === "servicios" ? "active" : ""}`}
              onClick={() => setTab("servicios")}
            >
              Servicios
            </button>
            <button
              className={`tab-btn ${tab === "usuarios" ? "active" : ""}`}   // ← AGREGADO
              onClick={() => setTab("usuarios")}
            >
              Usuarios
            </button>
            <button
              className={`tab-btn ${tab === "general" ? "active" : ""}`}
              onClick={() => setTab("general")}
            >
              General
            </button>
          </div>

          <div className="config-tab-content">
            {tab === "estaciones" && <ConfigEstaciones />}
            {tab === "servicios" && <ConfigServicios />}
            {tab === "usuarios" && <ConfigUsuarios />}
            {tab === "general" && <ConfigGeneral />}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
