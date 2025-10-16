import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTurnos } from "../context/TurnosContext";

import "./AgendarTurno.css";

// Convierte Date o string YYYY-MM-DD a YYYY-MM-DD local
function formatDateLocal(date) {
  if (!date) return "";
  let d;
  if (date instanceof Date) d = date;
  else if (typeof date === "string") {
    const [y, m, day] = date.split("-");
    d = new Date(y, m - 1, day);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Formatea YYYY-MM-DD -> dd/mm/yy
const formatDateForSummary = (fechaStr) => {
  if (!fechaStr) return "";
  const [y, m, d] = fechaStr.split("-");
  return `${d}/${m}/${y.slice(-2)}`;
};

function AgendarTurno() {
  const location = useLocation();
  const navigate = useNavigate();
  const { turnos, setTurnos } = useTurnos();


  const { turno, isEditing } = location.state || {};
  // Para edición
  const { hora: horaTurno, fecha: fechaTurno, estacion: estacionTurno } = turno || {};
  // Para nuevo turno
  const { hora: horaSeleccionada, fecha: fechaSeleccionada, estacion: estacionSeleccionada } = location.state || {};

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    patente: "",
    modelo: "",
    anio: "",
    servicio: "",
    fecha: "",
    hora: "",
    estacion: "",
    observaciones: "",
  });

  const [errorFecha, setErrorFecha] = useState("");


   // la usamos para completar la fechaHora
  useEffect(() => {
    if (isEditing && turno) {
      setFormData({
        nombre: turno.cliente || "",
        apellido: turno.apellido || "",
        correo: turno.correo || "",
        telefono: turno.telefono || "",
        patente: turno.patente || "",
        marca: turno.marca || "",
        modelo: turno.modelo || "",
        anio: turno.anio || "",
        servicio: turno.servicio || "",
        fecha: formatDateLocal(turno.fecha), 
        hora: turno.hora || "",
        estacion: turno.estacion || "",
        observaciones: turno.observaciones || "",
      });
    } else if (horaSeleccionada && fechaSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        fecha: formatDateLocal(fechaSeleccionada), 
        hora: horaSeleccionada,
        estacion: estacionSeleccionada || "",
      }));
    }
  }, [isEditing, turno, horaSeleccionada, fechaSeleccionada, estacionSeleccionada]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCancelar = () => navigate("/agenda");

  const handleGuardar = () => {
    const hoy = new Date();
    const [y, m, d] = formData.fecha.split("-");
    const fechaSeleccionada = new Date(y, m - 1, d);
    const maxFecha = new Date();
    maxFecha.setDate(hoy.getDate() + 14);

    setErrorFecha(""); 

    if (isNaN(fechaSeleccionada)) {
      setErrorFecha("Por favor, seleccione una fecha válida.");
      return;
    }

    if (fechaSeleccionada < hoy.setHours(0, 0, 0, 0)) {
      setErrorFecha("No se pueden agendar turnos en fechas pasadas.");
      return;
    }

    if (fechaSeleccionada > maxFecha) {
      setErrorFecha("Solo se pueden agendar turnos con hasta 2 semanas de anticipación.");
      return;
    }
    const nuevoTurno = {
      id: turno?.id || Date.now(), // genera un id único si es nuevo
      ...formData,
      fecha: formatDateLocal(formData.fecha),
      estado: isEditing ? turno.estado : "Disponible",
    };

    // Guardar o modificar el turno
    if (isEditing) {
      // Reemplazar el turno existente
      const turnosActualizados = turnos.map((t) => t.id === nuevoTurno.id ? nuevoTurno : t);
      setTurnos(turnosActualizados);
    } else {
      // Agregar nuevo turno
      setTurnos([...turnos, nuevoTurno]);
    }
    navigate("/agenda");
  };

  const handleCancelarTurno = () => {
    if (window.confirm("¿Seguro que desea cancelar este turno?")) {
      if (isEditing && turno?.id) {
        setTurnos(turnos.filter((t) => t.id !== turno.id));
      }
      navigate("/agenda");
    }
  };


 
  return (
    <div className="agendar-page">
      <Header username="Admin" />
      <div className="agendar-content">
        <Sidebar />
        <main className="main-content">
          <h1>{isEditing ? "Modificar Turno" : "Agendar Turno"}</h1>

          <div className="agendar-container">
            {/* FORMULARIO */}
            <div className="form-section">
              <h2>Datos del Cliente</h2>
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={formData.correo}
                  onChange={handleChange}
                />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <h2>Datos del Vehículo</h2>
              <div className="form-group">
                <input
                  type="text"
                  name="patente"
                  placeholder="Patente"
                  value={formData.patente}
                  onChange={handleChange}
                />
                <select name="marca" value={formData.marca} onChange={handleChange}>
                  <option value="">Marca</option>
                  <option value="Renault">Renault</option>
                  <option value="Otro">Otro</option>                  
                </select>
                <select name="modelo" value={formData.modelo} onChange={handleChange}>
                  <option value="">Modelo</option>
                  <option value="Duster">Duster</option>
                  <option value="Arkana">Arkana</option>
                  <option value="KWID">KWID</option>
                </select>
                <select name="anio" value={formData.anio} onChange={handleChange}>
                  <option value="">Año</option>
                  {[...Array(50)].map((_, i) => {
                    const year = 2025 - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <h2>Servicio Solicitado</h2>
              <div className="form-group">
                <select name="servicio" value={formData.servicio} onChange={handleChange}>
                  <option value="">Seleccione un servicio</option>
                  <option value="Cambio de aceite">Cambio de aceite</option>
                  <option value="Frenos">Frenos</option>
                  <option value="Revisión general">Revisión general</option>
                </select>
              </div>

              <h2>Fecha y Hora</h2>
              <div className="form-group">
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                />
                
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="estacion"
                  placeholder="Estación asignada"
                  value={formData.estacion}
                  onChange={handleChange}
                />
              </div>

              {/* Modal de error para fecha */}
              {errorFecha && (
                <div className="error-modal">
                  <p>{errorFecha}</p>
                  <button onClick={() => setErrorFecha("")}>X</button>
                </div>
              )}

              <h2>Observaciones</h2>
              <textarea
                name="observaciones"
                placeholder="Escriba observaciones adicionales..."
                value={formData.observaciones}
                onChange={handleChange}
                rows={4}
              ></textarea>
            </div>

            {/* RESUMEN */}
            <div className="summary-section">
              <h2>Resumen del Turno</h2>
              <p><strong>Cliente:</strong> {formData.nombre} {formData.apellido}</p>
              <p><strong>Teléfono:</strong> {formData.telefono}</p>
              <p><strong>Correo:</strong> {formData.correo}</p>
              <p><strong>Vehículo:</strong> {formData.marca} {formData.modelo} ({formData.anio}) </p>
              <p><strong>Patente:</strong> {formData.patente}</p>
              <p><strong>Servicio:</strong> {formData.servicio}</p>
              <p><strong>Fecha:</strong> {formatDateForSummary(formData.fecha)}</p>
              <p><strong>Hora:</strong> {formData.hora}</p>
              <p><strong>Estación:</strong> {formData.estacion}</p>
            </div>
          </div>

          {/* BOTONES */}
          <div className="buttons">
            <button className="cancel-btn" onClick={handleCancelar}>Cancelar</button>
            
            {/* Botón para cancelar el turno solo en modo edición */}
            {isEditing && (
              <button 
                className="cancel-turno-btn" 
               onClick={handleCancelarTurno}
              >
                Cancelar turno
              </button>
            )}
             {/* Botón para guardar cambios o guardar turno nuevo */}
            <button className="save-btn" onClick={handleGuardar}>
              {isEditing ? "Guardar cambios" : "Guardar turno"}</button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AgendarTurno;
