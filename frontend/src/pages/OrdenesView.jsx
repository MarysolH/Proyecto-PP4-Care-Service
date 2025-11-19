import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { getOrdenes } from "../services/ordenesService";
import { useTurnos } from "../context/TurnosContext";
import "../styles/OrdenesView.css";

export default function OrdenesView({ username = "Administrativo" }) {
  const [ordenes, setOrdenes] = useState([]);
  const { turnos } = useTurnos(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const data = (await getOrdenes()) || [];

        // Fecha de hoy en formato YYYY-MM-DD
        const hoy = new Date();
        const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

        // Filtramos solo órdenes de hoy
        const ordenesHoy = data.filter((o) => {
          const fechaOrdenStr = o.fechaIngreso || o.createdAt || o.fechaTurno;
          if (!fechaOrdenStr) return false;

          const fechaOrden = new Date(fechaOrdenStr);
          return (
            fechaOrden.getFullYear() === hoy.getFullYear() &&
            fechaOrden.getMonth() === hoy.getMonth() &&
            fechaOrden.getDate() === hoy.getDate()
          );
        });

        setOrdenes(ordenesHoy);
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      }
    };

    fetchOrdenes();
  }, [turnos]); // se recarga automáticamente al cambiar turnos

  const handleVerDetalle = (orden) => {
    navigate("/detalle-orden", { state: { orden } });
  };

  return (
    <div className="ordenes-view-page">
      <Header username={username} />
      <div className="ordenes-view-content">
        <Sidebar />
        <main className="ordenes-view-main">
          <h1>Órdenes en Taller </h1>
          <table className="ordenes-view-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Estado</th>
                <th>Hora Ingreso</th>
                <th>Estación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.length > 0 ? (
                ordenes.map((orden) => (
                  <tr key={orden._id}>
                    <td>{new Date(orden.fechaTurno || orden.fechaIngreso || orden.createdAt).toLocaleDateString("es-AR")}</td>
                    <td>{orden.servicio || "-"}</td>
                    <td>{orden.cliente ? `${orden.cliente.nombre} ${orden.cliente.apellido}` : "-"}</td>
                    <td>{orden.vehiculo ? `${orden.vehiculo.marca} ${orden.vehiculo.modelo} (${orden.vehiculo.patente})` : "-"}</td>
                    <td className={`estado-orden ${orden.estado?.toUpperCase().replace(/\s+/g, "-")}`}>
                      {orden.estado || "-"}
                    </td>
                    <td>{orden.horaIngreso || "-"}</td>
                    <td>{orden.estacion || "-"}</td>
                    <td>
                      <button onClick={() => handleVerDetalle(orden)}>Ver detalle</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>No hay órdenes registradas para hoy</td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />
    </div>
  );
}
