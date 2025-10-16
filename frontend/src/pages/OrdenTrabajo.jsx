import React, { useState} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";

import "./OrdenTrabajo.css";

function OrdenTrabajo() {
  const location = useLocation();
  const navigate = useNavigate();

  
  // Datos simulados (actualizar con backend)
  const turno = location.state?.turno || {
    numero: "001",
    fecha: "2025-10-08",
    hora: "10:00",
    estacion: "2",
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "1123456789",
    marca: "Renault",
    modelo: "Duster",
    anio: "2025",
    patente: "ABC123",
    servicio: "Cambio de aceite",
    estado: "Reservado", // para consistencia con TurnosView
};

  const cliente = turno.nombre && turno.apellido ? `${turno.nombre} ${turno.apellido}` : "-";
  const vehiculo = turno.marca && turno.modelo ? `${turno.marca} ${turno.modelo} (${turno.anio})` : "-";
  
  // Hora actual autocompletada
  const horaActual = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Estado para inputs
  const [horaIngreso, setHoraIngreso] = useState(horaActual);
  const [estacionAsignada, setEstacionAsignada] = useState("");
  const [comentarios, setComentarios] = useState("");
  
  const handleCancelar = () => {
    navigate("/turnos-view"); // ruta hacia TurnosView
  };

  const handleConfirmarIngreso = () => {
    // Creamos la orden con los datos necesarios
    const orden = {
      ...turno,
      horaIngreso,
      estacionAsignada: estacionAsignada || turno.estacion,
      comentarios,
    };

    console.log("Ingreso confirmado, orden enviada al taller:", orden);

    // Redirigimos a OrdenesView
    navigate("/ordenes-view", { state: { orden } });
  };

  return (
    <div className="orden-page">
      <Header username="Admin" />
      <div className="orden-content">
        <Sidebar />
        <main className="main-content">
          <h1>Orden de Trabajo / Ingreso de Vehículo</h1>

          <div className="orden-container">
            {/* Rectángulo 1: Datos del turno */}
            <div className="card-like datos-turno">
              <div className="columna">
                <p><strong>Turno N°:</strong> #{turno.numero}</p>
                <p><strong>Fecha:</strong> {turno.fecha}</p>
                <p><strong>Hora:</strong> {turno.hora}</p>
                <p><strong>Estación N°:</strong> {turno.estacion}</p>
              </div>
              <div className="columna">
                <p><strong>Cliente:</strong> {cliente}</p>
                <p><strong>Teléfono:</strong> {turno.telefono || "-"}</p>
                <p><strong>Vehículo:</strong> {vehiculo}</p>
                <p><strong>Servicio:</strong> {turno.servicio}</p>
              </div>
            </div>

            {/* Rectángulo 2: Ingreso al taller */}
            <div className="card-like ingreso-taller">
              <div className="fila-superior">
                <div className="campo">
                  <label>Hora de ingreso:</label>
                  <input 
                    type="time"
                    value={horaIngreso}
                    onChange={(e) => setHoraIngreso(e.target.value)} />
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

            <div className="botones-container">
                <button className="cancel-btn" onClick={handleCancelar}>Cancelar</button>
                <button className="save-btn" onClick={handleConfirmarIngreso}>Confirmar ingreso</button>
            </div>
            
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default OrdenTrabajo;
