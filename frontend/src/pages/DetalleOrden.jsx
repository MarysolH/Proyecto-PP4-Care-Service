import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/DetalleOrden.css";

function DetalleOrden() {
  const location = useLocation();
  const navigate = useNavigate();

  const orden = location.state?.orden;

  if (!orden) {
    return <p>No se encontraron datos de la orden.</p>;
  }

  const handleEnviarAFacturar = () => {    
    navigate("/facturacion-view", { state: { orden } });
  };


  return (
    <div className="detalle-orden-page">
      <Header username="Admin" />
      <div className="detalle-orden-content">
        <Sidebar />
        <main className="detalle-orden-main">
          <h1 className="detalle-orden-title">Detalle de Orden</h1>

          {/* Datos de la orden */}
          <div className="detalle-orden-card datos-generales">
             <div className="columna">
              
              <p><strong>Hora Ingreso:</strong> {orden.horaIngreso}</p>
              <p><strong>Estación:</strong> {orden.estacion}</p>
              <p><strong>Estado: </strong>
                <span className={`estado-orden ${orden.estado.replace(" ", "-")}`}>
                  {orden.estado}
                </span>
              </p>
              <p><strong>Servicio:</strong> {orden.servicio || "-"}</p>
            </div>
            <div className="columna">
              <p><strong>Cliente:</strong> {`${orden.cliente?.nombre || ""} ${orden.cliente?.apellido || ""}`}</p>
              <p><strong>Teléfono:</strong> {orden.cliente?.telefono || "-"}</p>
              <p><strong>Vehículo:</strong> {`${orden.vehiculo?.marca || ""} ${orden.vehiculo?.modelo || ""} (${orden.vehiculo?.anio || ""})`}</p>
              <p><strong>Patente:</strong> {orden.vehiculo?.patente || "-"}</p>              
            </div>
          </div>

          {/* Servicios realizados */}
          <div className="detalle-orden-card servicios-realizados">
            <h3>Servicios realizados</h3>

            {/* Servicio principal */}
            {orden.servicioRealizado ? (
                <p><strong>Servicio principal:</strong> {orden.servicio}</p>
            ) : (
                <p><strong>Servicio principal:</strong> No realizado</p>
            )}

            {/* Servicios adicionales */}
            {orden.serviciosAdicionales?.length > 0 && (
                <div>
                <strong>Servicios adicionales realizados:</strong>
                <ul>
                    {orden.serviciosAdicionales
                    .filter(s => s.realizado) // mostramos solo los hechos
                    .map((s, i) => (
                        <li key={i}>{s.nombre}</li>
                    ))}
                </ul>
                </div>
            )}

            {/* Puntos de control */}
            {orden.puntosControl && orden.puntosControl.length > 0 && (
                <div>
                <strong>Puntos de control realizados:</strong>
                <ul>
                    {orden.puntosControl
                    .filter(p => p.realizado)
                    .map((p, i) => (
                        <li key={i}>{p.nombre}</li>
                    ))}
                </ul>
                </div>
            )}

            {/* Comentarios u observaciones */}
            {orden.comentarios && (
                <p><strong>Observaciones:</strong> {orden.comentarios}</p>
            )}
            </div>

            {/* Botones */}
            <div className="detalle-orden-botones">
              <button className="detalle-orden-btn-volver" onClick={() => navigate("/ordenes-view")}>
                Volver
              </button>
              <button
                className="detalle-orden-btn-enviar"
                onClick={handleEnviarAFacturar}
              >
                Enviar a Facturar
              </button>
              
            </div>
          </main>
        </div>
      <Footer />
    </div>
  );
}

export default DetalleOrden;
