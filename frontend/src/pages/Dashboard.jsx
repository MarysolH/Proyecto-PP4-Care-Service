import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { FaCalendarAlt, FaTools, FaClock, FaCar, FaDollarSign, FaWrench } from "react-icons/fa";
import { useTurnos } from "../context/TurnosContext";

import "./Dashboard.css";

function Dashboard() {
  const { turnos } = useTurnos();
  const hoy = new Date().toISOString().slice(0, 10); // fecha actual YYYY-MM-DD

  // Estadísticas dinámicas
  const turnosPendientes = turnos.filter(
    t => t.estadoOrden === "PENDIENTE" && t.fecha === hoy
  ).length;

  const serviciosRealizados = turnos.filter(t => t.servicioRealizado === true).length;

  const serviciosDemorados = turnos.filter(
    t => t.estadoOrden === "PENDIENTE" && new Date(t.hora) < new Date()
  ).length;

  const vehiculosTaller = turnos.filter(t => t.estadoOrden === "EN CURSO").length;

  const facturacionDia = turnos
    .filter(t => t.estadoOrden === "FINALIZADO" && t.fecha === hoy)
    .reduce((sum, t) => sum + (t.pago || 0), 0);

  const serviciosEnCurso = turnos.filter(t => t.estadoOrden === "EN CURSO").length;

  return (
    <div className="dashboard-container">
      <Header username="Admin" />

      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <div className="cards-container">
            <div className="card">
              <h3>Turnos pendientes del día</h3>
              <FaCalendarAlt className="card-icon" />
              <p>{turnosPendientes}</p>
            </div>
            <div className="card">
              <h3>Servicios realizados</h3>
              <FaTools className="card-icon" />
              <p>{serviciosRealizados}</p>
            </div>
            <div className="card">
              <h3>Servicios con demoras</h3>
              <FaClock className="card-icon" />
              <p>{serviciosDemorados}</p>
            </div>
            <div className="card">
              <h3>Vehículos en el taller</h3>
              <FaCar className="card-icon" />
              <p>{vehiculosTaller}</p>
            </div>
            <div className="card">
              <h3>Pagos / Facturación del día</h3>
              <FaDollarSign className="card-icon" />
              <p>${facturacionDia}</p>
            </div>
            <div className="card">
              <h3>Servicios en curso</h3>
              <FaWrench className="card-icon" />
              <p>{serviciosEnCurso}</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;



