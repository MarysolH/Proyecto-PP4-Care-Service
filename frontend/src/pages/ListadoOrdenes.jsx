import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { getOrdenes } from "../services/ordenesService";
import { useTurnos } from "../context/TurnosContext";
import "../styles/ListadoOrdenes.css";

export default function ListadoOrdenes({
  filtroEstacion = null,
  filtroMecanico = null,
  username = "Taller",
}) {
  const { turnos } = useTurnos();
  const [ordenes, setOrdenes] = useState([]);
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
        if (!o.fechaIngreso) return false;
        const fecha = new Date(o.fechaIngreso);
        if (isNaN(fecha.getTime())) return false;

        const fechaStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
        return fechaStr === hoyStr;
      });

      // Filtrado adicional opcional
      const ordenesFiltradas = ordenesHoy.filter((o) => {
        let ok = true;
        if (filtroEstacion) ok = o.estacion === filtroEstacion;
        if (filtroMecanico) ok = ok && o.mecanico?._id === filtroMecanico;
        return ok;
      });

      setOrdenes(ordenesFiltradas);
    } catch (err) {
      console.error("Error cargando órdenes:", err);
    }
  };

  fetchOrdenes();
}, [filtroEstacion, filtroMecanico, turnos]);

  const handleVerDetalle = (orden) => {
    navigate("/orden-taller", {
      state: { orden, mecanico: filtroMecanico || null },
    });
  };

  return (
    <div className="listado-ordenes-page">
      <Header username={username} />

      <div className="listado-ordenes-content">
        <main className="listado-ordenes-main">
          <div className="listado-ordenes-header">
            <h1 className="listado-ordenes-title">Órdenes del día</h1>
            <button className="volver-btn" onClick={() => navigate("/taller")}>
              ← Volver a Taller
            </button>
          </div>

          <div className="listado-ordenes-tabla-container">
            <table className="listado-ordenes-table">
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
                      <td>
                        {orden.fechaIngreso
                          ? new Date(orden.fechaIngreso).toLocaleDateString("es-AR")
                          : "-"}
                      </td>

                      <td title={orden.servicio}>{orden.servicio || "-"}</td>

                      <td>
                        {orden.cliente
                          ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                          : "-"}
                      </td>

                      <td>
                        {orden.vehiculo
                          ? `${orden.vehiculo.marca} ${orden.vehiculo.modelo} (${orden.vehiculo.patente})`
                          : "-"}
                      </td>

                      <td
                        className={`estado-orden ${orden.estado
                          ?.toUpperCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {orden.estado || "-"}
                      </td>

                      <td>{orden.horaIngreso || "-"}</td>
                      <td>{orden.estacion || "-"}</td>

                      <td>
                        <button
                          className="detalle-btn"
                          onClick={() => handleVerDetalle(orden)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No hay órdenes registradas para hoy.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
