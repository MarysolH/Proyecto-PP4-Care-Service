import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { formatDateForSummary } from "../utils/dateUtils";
import { createOrden } from "../services/ordenesService";
import "../styles/OrdenTrabajo.css";

function OrdenTrabajo() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibimos el turno desde TurnosView
  
  const turno = location.state?.turno || {};

  // Helpers para acceder a datos anidados
  // Cliente
  const clienteNombre = t => t.cliente?.nombre || "";
  const clienteApellido = t => t.cliente?.apellido || "";
  const clienteTelefono = t => t.cliente?.telefono || "";

  // Vehículo
  const vehiculoMarca = t => t.vehiculo?.marca || "";
  const vehiculoModelo = t => t.vehiculo?.modelo || "";
  const vehiculoAnio = t => t.vehiculo?.anio || "";
  const vehiculoPatente = t => t.vehiculo?.patente || "";

  // Hora actual autocompletada
  const horaActual = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Estado para inputs
  const [horaIngreso, setHoraIngreso] = useState(horaActual);
  const [estacionAsignada, setEstacionAsignada] = useState("");
  const [comentarios, setComentarios] = useState("");

  // Estados para mostrar mensajes flotantes
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("exito");

  const handleCancelar = () => {
    navigate("/turnos-view");
  };

  const handleConfirmarIngreso = async () => {
  if (!turno || (!turno.numero && !turno._id)) {
    setMensaje("No se encontró información del turno.");
    setTipoMensaje("error");
    setTimeout(() => setMensaje(null), 3000);
    return;
  }

  //   OBJETO ORDEN DE TRABAJO
  
  const orden = {
    // --- Identificadores ---
    turnoNumero: turno._id || turno.numero,

    // --- Cliente ---
    cliente: {
      nombre: turno.cliente?.nombre || "",
      apellido: turno.cliente?.apellido || "",
      telefono: turno.cliente?.telefono || "-",
      email: turno.cliente?.email || "",
    },

    // --- Vehículo ---
    vehiculo: {
      marca: turno.vehiculo?.marca || "-",
      modelo: turno.vehiculo?.modelo || "",
      anio: turno.vehiculo?.anio || "",
      patente: turno.vehiculo?.patente || "-",
    },

    // --- Servicio y observaciones ---
    servicio: turno.servicio || "-",
    comentarios: comentarios || "",

    // --- Fechas IMPORTANTES ---
    fechaTurno: turno.fecha || null,                 // Fecha solicitada del turno
    fechaIngreso: new Date().toISOString(),          // Fecha real de ingreso
    horaIngreso: horaIngreso || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),

    // --- Estado y estación ---
    estado: "PENDIENTE",
    estacion: estacionAsignada || turno.estacion,

    // --- Metainformación ---
    creadoPor: "sistema",
    createdAt: new Date().toISOString(),
  };

  console.log("Enviando orden al backend:", orden);

  try {
    const creada = await createOrden(orden);

    if (creada) {
      setMensaje("Orden de trabajo generada correctamente.");
      setTipoMensaje("exito");

      setTimeout(() => {
        navigate("/turnos-view", {
          state: { turnoConOrden: turno._id || turno.numero },
        });
      }, 2000);

      setTimeout(() => setMensaje(null), 2500);
    } else {
      setTipoMensaje("error");
      setMensaje("Error al crear la orden.");
      setTimeout(() => setMensaje(null), 3000);
    }
  } catch (error) {
    console.error("Error al crear la orden:", error);
    setTipoMensaje("error");
    setMensaje("Error de conexión con el servidor.");
    setTimeout(() => setMensaje(null), 3000);
  }
};
    console.log(">>> Turno recibido en OrdenTrabajo:", turno);


  return (
    <div className="orden-page">
      <Header username="Admin" />
      <div className="orden-content">
        <Sidebar />
        <main className="main-content">
          <h1>Orden de Trabajo / Ingreso de Vehículo</h1>

          <div className="orden-container">
            {/* --- DATOS DEL TURNO --- */}
            <div className="card-like datos-turno">
              <div className="columna">
                {/*<p><strong>Turno N°:</strong> {turno.numero || turno._id || "-"}</p>*/}
                <p><strong>Fecha:</strong> {turno.fecha ? formatDateForSummary(turno.fecha) : "-"}</p>
                <p><strong>Hora:</strong> {turno.hora || "-"}</p>
                <p><strong>Estación N°:</strong> {turno.estacion || "-"}</p>
                 <p><strong>Servicio:</strong> {turno.servicio || "-"}</p>
              </div>
              <div className="columna">
                <p><strong>Cliente:</strong> {`${clienteNombre(turno)} ${clienteApellido(turno)}`}</p>
                <p><strong>Teléfono:</strong> {clienteTelefono(turno)}</p>
                <p><strong>Vehículo:</strong> {`${vehiculoMarca(turno)} ${vehiculoModelo(turno)} (${vehiculoAnio(turno)})`}</p>
                <p><strong>Patente:</strong> {vehiculoPatente(turno)}</p>
               
              </div>
            </div>

            {/* --- INGRESO AL TALLER --- */}
            <div className="card-like ingreso-taller">
              <div className="fila-superior">
                <div className="campo">
                  <label>Hora de ingreso:</label>
                  <input
                    type="time"
                    value={horaIngreso}
                    onChange={(e) => setHoraIngreso(e.target.value)}
                  />
                </div>
                <div className="campo">
                  <label>Reasignar estación:</label>
                  <select
                    value={estacionAsignada}
                    onChange={(e) => setEstacionAsignada(e.target.value)}
                  >
                    <option value="">Seleccionar</option>
                    <option value="1">Estación 1</option>
                    <option value="2">Estación 2</option>
                    <option value="3">Estación 3</option>
                    <option value="4">Estación 4</option>
                    <option value="5">Estación 5</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="comentarios">
                <label>Comentarios:</label>
                <textarea
                  rows="6"
                  placeholder="Observaciones o detalles adicionales..."
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                />
              </div>
            </div>

            {/* --- BOTONES --- */}
            <div className="botones-container">
              <button className="cancel-btn" onClick={handleCancelar}>
                Cancelar
              </button>
              <button className="save-btn" onClick={handleConfirmarIngreso}>
                Confirmar ingreso
              </button>
              {mensaje && (
                <div className={`mensaje-flotante unificado ${tipoMensaje === "exito" ? "exito" : "error"}`}>
                  {mensaje}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
    
  );
}

export default OrdenTrabajo;

