import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginMecanico from "./LoginMecanico";

import { getEstaciones } from "../services/estacionesService";
import { getUsuarios } from "../services/usuariosService";

import "../styles/Taller.css";

function Taller() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState(null);
  const [estaciones, setEstaciones] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const est = await getEstaciones(); // trae { _id, numero, mecanico }
      const usuarios = await getUsuarios(); // trae todos los usuarios

      // Filtrar solo mecánicos
      const mec = usuarios.filter((u) => u.rol === "mecanico");
      setMecanicos(mec);

      // Combinar: reemplazar el _id del mecánico por objeto con nombre/apellido
      const estacionesConMec = est.map((e) => {
        const mecId = typeof e.mecanico === "string" 
          ? e.mecanico 
          : e.mecanico?._id;

  const m = mec.find((u) => u._id === mecId);

        return {
          ...e,
          mecanico: m ? { _id: m._id, nombre: m.nombre, apellido: m.apellido } : null,
        };
      });

      setEstaciones(estacionesConMec);
    } catch (err) {
      console.error("Error cargando estaciones o mecánicos:", err);
    }
  };

  const handleCardClick = (mecanico) => {
    if (!mecanico) return;
    setMecanicoSeleccionado(`${mecanico.apellido}, ${mecanico.nombre}`);
    setLoginVisible(true);
  };

  const handleLogin = (clave) => {
    if (!mecanicoSeleccionado) return;
    setLoginVisible(false);
    navigate("/orden-taller", { state: { mecanico: mecanicoSeleccionado } });
  };

  const handleCloseLogin = () => setLoginVisible(false);

  return (
    <div className="taller-page">
      <Header username="Taller" />
      <main className="taller-main">
        <button
          className="volver-desarrollo"
          onClick={() => navigate("/dashboard")}
          style={{ marginBottom: "20px" }}
        >
          ← Volver al Inicio
        </button>

        <h1 className="taller-title">Taller</h1>

        <div className="taller-cards-container">
          {estaciones.map((est) => (
            <div
              key={est._id}
              className="taller-card"
              onClick={() => handleCardClick(est.mecanico)}
            >
              <p className="taller-label">ESTACIÓN</p>
              <h2 className="taller-number">{est.numero}</h2>
              <p className="taller-mechanic">
                {est.mecanico
                  ? `${est.mecanico.apellido}, ${est.mecanico.nombre}`
                  : "Sin asignar"}
              </p>

              <div className="taller-status">
                <p className="pendientes">
                  Pendientes <span>0</span>
                </p>
                <p className="en-curso">
                  En curso <span>0</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {loginVisible && mecanicoSeleccionado && (
        <LoginMecanico
          mecanico={mecanicoSeleccionado}
          onLogin={handleLogin}
          onClose={handleCloseLogin}
        />
      )}
    </div>
  );
}

export default Taller;
