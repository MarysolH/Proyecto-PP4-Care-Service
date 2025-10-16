import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginMecanico from "./LoginMecanico";
import "./Taller.css";

function Taller() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [mecanicoSeleccionado, setMecanicoSeleccionado] = useState(null);
  const navigate = useNavigate();

  // Datos simulados de estaciones y mecánicos
  const estaciones = [
    { numero: 1, mecanico: "Carlos Pérez", pendientes: 1, enCurso: 1 },
    { numero: 2, mecanico: "Mariana López", pendientes: 0, enCurso: 1 },
    { numero: 3, mecanico: "Luis Torres", pendientes: 2, enCurso: 0 },
    { numero: 4, mecanico: "Ana Martínez", pendientes: 1, enCurso: 1 },
    { numero: 5, mecanico: "Jorge Díaz", pendientes: 0, enCurso: 0 },
  ];

  const handleCardClick = (mecanico) => {
    setMecanicoSeleccionado(mecanico);
    setLoginVisible(true);
  };

  const handleLogin = (mecanico, clave) => {
    console.log("Login de:", mecanico, "Clave:", clave);
    // Aquí redirigir a Ordenes pendientes/en curso
    setLoginVisible(false);

    // Redirigir a la pantalla del taller del mecánico
    navigate("/orden-taller", { state: { mecanico } });
  };

  const handleCloseLogin = () => {
    setLoginVisible(false);
  };


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
          {estaciones.map((estacion) => (
            <div key={estacion.numero} className="taller-card"
            onClick={() => handleCardClick(estacion.mecanico)}
            >
              <p className="taller-label">ESTACIÓN</p>
              <h2 className="taller-number">{estacion.numero}</h2>
              <p className="taller-mechanic">{estacion.mecanico}</p>

              <div className="taller-status">
                <p className="pendientes">
                  Pendientes <span>{estacion.pendientes}</span>
                </p>
                <p className="en-curso">
                  En curso <span>{estacion.enCurso}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      {loginVisible && (
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
