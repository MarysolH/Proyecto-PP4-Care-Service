import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaCar, FaDollarSign, FaTools } from "react-icons/fa";
import { useTurnos } from "../context/TurnosContext";
import { getOrdenes } from "../services/ordenesService";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { turnos } = useTurnos();
  const [ordenes, setOrdenes] = useState([]);

  const [turnosReservadosHoy, setTurnosReservadosHoy] = useState(0);
  const [turnosDisponiblesHoy, setTurnosDisponiblesHoy] = useState(0);
  const [vehiculosTallerHoy, setVehiculosTallerHoy] = useState(0);
  const [serviciosFinalizadosHoy, setServiciosFinalizadosHoy] = useState(0);
  const [pagosHoy, setPagosHoy] = useState(0);
  const [serviciosEnCursoHoy, setServiciosEnCursoHoy] = useState(0);

  useEffect(() => {
    const fetchOrdenes = async () => {
      const data = await getOrdenes() || [];
      setOrdenes(data);

      const hoy = new Date();
      const hoyStr = hoy.toDateString();

      // Turnos reservados del día
      const reservados = turnos.filter(t => {
        const fecha = new Date(t.fecha);
        return fecha.toDateString() === hoyStr && t.estado === "RESERVADO";
      });
      setTurnosReservadosHoy(reservados.length);

      // Turnos disponibles del día
      const disponibles = turnos.filter(t => {
        const fecha = new Date(t.fecha);
        return fecha.toDateString() === hoyStr && !t.cliente;
      });
      setTurnosDisponiblesHoy(disponibles.length);

      // Vehículos en taller (pendientes o en curso)
      const enTaller = data.filter(o => {
        const fecha = new Date(o.fechaIngreso);
        return fecha.toDateString() === hoyStr && ["PENDIENTE","EN CURSO"].includes(o.estado);
      });
      setVehiculosTallerHoy(enTaller.length);

      // Servicios finalizados hoy
      const finalizados = data.filter(o => {
        if (!o.fechaFinalizado) return false;
        const fecha = new Date(o.fechaFinalizado);
        return fecha.toDateString() === hoyStr && o.estado === "FINALIZADO";
      });
      setServiciosFinalizadosHoy(finalizados.length);

      // Pagos / facturación del día (sumamos totales de órdenes finalizadas)
      const pagos = finalizados.reduce((acc, o) => acc + (o.total || 0), 0);
      setPagosHoy(pagos);

      // Servicios en curso hoy
      const enCurso = data.filter(o => {
        const fecha = new Date(o.fechaIngreso);
        return fecha.toDateString() === hoyStr && o.estado === "EN CURSO";
      });
      setServiciosEnCursoHoy(enCurso.length);
    };

    fetchOrdenes();
  }, [turnos]);

  return (
    <div className="dashboard-container">
      <Header username="Admin" />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          <div className="cards-container">
            <div className="card">
              <h3>Turnos reservados hoy</h3>
              <FaCalendarAlt className="card-icon" />
              <p className="card-number">{turnosReservadosHoy}</p>
            </div>
            <div className="card">
              <h3>Turnos disponibles hoy</h3>
              <FaCheckCircle className="card-icon" />
              <p className="card-number">{turnosDisponiblesHoy}</p>
            </div>
            <div className="card">
              <h3>Vehículos en taller</h3>
              <FaCar className="card-icon" />
              <p className="card-number">{vehiculosTallerHoy}</p>
            </div>
            <div className="card">
              <h3>Servicios finalizados</h3>
              <FaTools className="card-icon" />
              <p className="card-number">{serviciosFinalizadosHoy}</p>
            </div>
            <div className="card">
              <h3>Pagos / Facturación hoy</h3>
              <FaDollarSign className="card-icon" />
              <p className="card-number">${pagosHoy.toLocaleString("es-AR")}</p>
            </div>
            <div className="card">
              <h3>Servicios en curso</h3>
              <FaClock className="card-icon" />
              <p className="card-number">{serviciosEnCursoHoy}</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}



