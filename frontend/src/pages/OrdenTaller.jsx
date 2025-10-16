import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useTurnos } from "../context/TurnosContext";
import "./OrdenTaller.css";

function OrdenTaller() {
  const location = useLocation();
  const mecanico = location.state?.mecanico;
  const navigate = useNavigate();
  const { turnos, setTurnos } = useTurnos();

  // Orden recibida desde OrdenTrabajo
  const ordenRecibida = location.state?.orden;

  // Fallback a datos simulados si no viene nada
  const orden = ordenRecibida || {
    numero: "001",
    fecha: "2025-10-10",
    hora: "10:00",
    estacion: "2",
    cliente: "Juan Pérez",
    telefono: "1123456789",
    vehiculo: "Renault Duster",
    servicio: "Cambio de aceite",
  };

  // Estado de la orden
  const [estadoOrden, setEstadoOrden] = useState("PENDIENTE");
  const [servicioRealizado, setServicioRealizado] = useState(null); // null = no marcado, true = ✔, false = ✖

  // Servicios adicionales
  const [serviciosAdicionales, setServiciosAdicionales] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState("");

  // Puntos de control
  const [puntosControl, setPuntosControl] = useState(null);

  // Inputs controlados de ingreso
  const [horaIngreso, setHoraIngreso] = useState(orden.horaIngreso || "");
  const [estacionAsignada, setEstacionAsignada] = useState(
    orden.estacionAsignada || ""
  );
  const [comentarios, setComentarios] = useState(orden.comentarios || "");

  const [showModal, setShowModal] = useState(false);
  const [showEnviadoModal, setShowEnviadoModal] = useState(false);

  const estados = [
    { nombre: "PENDIENTE", color: "#7f7f7f" },
    { nombre: "EN CURSO", color: "#ffc107" },
    { nombre: "FINALIZADO", color: "#4caf50" },
  ];

  const agregarServicio = () => {
    if (nuevoServicio && !serviciosAdicionales.includes(nuevoServicio)) {
      setServiciosAdicionales([...serviciosAdicionales, nuevoServicio]);
      setNuevoServicio("");
    }
  };

  const eliminarServicio = (index) => {
    setServiciosAdicionales(serviciosAdicionales.filter((_, i) => i !== index));
  };

  const handleEnviarAFacturar = () => {
    if (servicioRealizado === null) {
      setShowModal(true);
      return;
    }

    // Construimos la orden final para enviar al backend
    const ordenFinal = {
      ...orden,
      horaIngreso,
      estacionAsignada,
      comentarios,
      estadoOrden,
      servicioRealizado,
      serviciosAdicionales,
      puntosControl,
      mecanico,
    };

    // Guardamos en TurnosContext
    setTurnos([...turnos, ordenFinal]);

    // Mostramos modal de enviado a administración
    setShowEnviadoModal(true);

    setTimeout(() => {
      setShowEnviadoModal(false);
      navigate("/taller"); // Redirige automáticamente al taller
    }, 2500);
  };

  const handleVolver = () => {
    navigate("/taller");
  };

  return (
    <div className="taller-page">
      <Header username={mecanico || "Taller"} />
      <main className="taller-main">
        <h1 className="taller-title">Orden de Trabajo - Taller</h1>

        {/* DATOS DEL TURNO */}
        <div className="orden-card datos-turno">
          <div className="columna">
            <p><strong>Turno N°:</strong> #{orden.numero}</p>
            <p><strong>Fecha:</strong> {orden.fecha}</p>
            <p><strong>Hora:</strong> {orden.hora}</p>
            <p><strong>Estación N°:</strong> {orden.estacion}</p>
          </div>
          <div className="columna">
            <p><strong>Cliente:</strong> {orden.cliente}</p>
            <p><strong>Teléfono:</strong> {orden.telefono}</p>
            <p><strong>Vehículo:</strong> {orden.vehiculo}</p>
            <p><strong>Servicio:</strong> {orden.servicio}</p>
          </div>
        </div>

        {/* ESTADO DE LA ORDEN */}
        <div className="orden-card estado-orden">
          {estados.map((estado) => (
            <div
              key={estado.nombre}
              className={`estado-boton ${
                estadoOrden === estado.nombre ? "activo" : ""
              }`}
              style={{ borderColor: estado.color }}
              onClick={() => setEstadoOrden(estado.nombre)}
            >
              <span
                className="circulo-estado"
                style={{ backgroundColor: estado.color }}
              ></span>
              {estado.nombre}
            </div>
          ))}
        </div>

        {/* SERVICIOS Y PUNTOS DE CONTROL */}
        <div className="orden-card servicios">
          <div className="fila-superior">
            <div className="servicio-principal-container">
              <div className="servicio-principal-fila">
                <label>SERVICIO:</label>
                <span>{orden.servicio}</span>
                <button
                  type="button"
                  className={servicioRealizado === true ? "activo-ok" : ""}
                  onClick={() => setServicioRealizado(true)}
                > ✔</button>
                <button
                  type="button"
                  className={servicioRealizado === false ? "activo-no" : ""}
                  onClick={() => setServicioRealizado(false)}
                >✖</button>
              </div>
            </div>

            <div className="servicios-adicionales-container">
              <div className="servicios-adicionales-fila">
                <label>SERVICIOS ADICIONALES</label>
                <select
                  value={nuevoServicio}
                  onChange={(e) => setNuevoServicio(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  {[
                    "Cambio de batería",
                    "Alineación",
                    "Frenos delanteros",
                    "Cambio de aceite",
                  ].map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={agregarServicio}>
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div className="fila-secundaria">
            <div className="fila-otros-container">
              <label>OTROS</label>
              <textarea
                placeholder="Acciones adicionales..."
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              />
            </div>

            <div className="lista-servicios-adicionales-container">
              {serviciosAdicionales.length > 0 ? (
                serviciosAdicionales.map((s, i) => (
                  <div key={i} className="item-servicio">
                    {s}{" "}
                    <button type="button" onClick={() => eliminarServicio(i)}>
                      ✖
                    </button>
                  </div>
                ))
              ) : (
                <div className="item-servicio vacio">
                  Se listan los adicionales agregados (x para eliminarlos)
                </div>
              )}
            </div>
          </div>

          <div className="fila-puntos-control">
            <label  
              className="link-puntos-control"
              onClick={() => navigate("/puntos-control-view")}
              style={{ cursor: "pointer" }}
            > PUNTOS DE CONTROL (Realizado)
            </label>
            <button
              type="button"
              className={puntosControl === true ? "activo-ok" : ""}
              onClick={() => setPuntosControl(true)}
            >
              ✔
            </button>
            <button
              type="button"
              className={puntosControl === false ? "activo-no" : ""}
              onClick={() => setPuntosControl(false)}
            >
              ✖
            </button>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="accion-botones">
          <button className="volver-btn" onClick={handleVolver}>
            Volver a Taller
          </button>
          <button className="cerrar-btn" onClick={handleEnviarAFacturar}>
            Enviar a Administración
          </button>
        </div>
      </main>

      {/* MODAL DE “Marcar servicio” */}
      {showModal && (
        <div className="orden-taller-modal-overlay">
          <div className="orden-taller-modal">
            <h2>Atención</h2>
            <p>
              Debes marcar si el servicio se realizó o no antes de continuar.
            </p>
            <button onClick={() => setShowModal(false)}>Aceptar</button>
          </div>
        </div>
      )}

      {/* MODAL DE “Enviado a Administración” */}
      {showEnviadoModal && (
        <div className="orden-taller-modal-overlay">
          <div className="orden-taller-modal">
            <h2>Orden enviada a Administración</h2>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default OrdenTaller;
