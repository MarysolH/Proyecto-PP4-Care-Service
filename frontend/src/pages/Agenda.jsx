import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTurnos } from "../context/TurnosContext";
import "./Agenda.css";

// Convierte Date o string YYYY-MM-DD a YYYY-MM-DD local
function formatDateLocal(date) {
  if (!date) return "";
  let d;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "string") {
    const [y, m, day] = date.split("-");
    d = new Date(y, m - 1, day);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Formatea YYYY-MM-DD -> dd/mm/yy
function formatDateForSummary(fechaStr) {
  if (!fechaStr) return "";
  const [y, m, d] = fechaStr.split("-");
  return `${d}/${m}/${y.slice(-2)}`;
}


function Agenda() {
  const navigate = useNavigate();

  // FECHAS Y TURNOS
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14); // 2 semanas adelante

  //Bloquea domingos
  const isSelectable = (date) => date.getDay() !== 0;
  
  // Fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Modal
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null); 
  const [mostrarModal, setMostrarModal] = useState(false);
  const [posicionModal, setPosicionModal] = useState({ top: 0, left: 0 });
  const modalRef = useRef(null);

  // Horarios y estaciones
  const horas = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  const estaciones = ["Estación 1", "Estación 2", "Estación 3", "Estación 4", "Estación 5"];

  const { turnos, setTurnos } = useTurnos();

  useEffect(() => {
  const nuevosTurnos = [];

  horas.forEach((hora) => {
    estaciones.forEach((_, idx) => {
      if (idx === estaciones.length - 1) return; // estación contingencia
      const estado = Math.random() < 0.3 ? "Reservado" : "Disponible";

      nuevosTurnos.push({
        id: `${selectedDate}-${hora}-${idx + 1}`,
        fecha: selectedDate.toISOString().slice(0, 10),
        hora,
        estacion: `${idx + 1}`,
        estado,
        cliente: estado === "Reservado" ? "Cliente Ejemplo" : null,
        telefono: estado === "Reservado" ? "1123456789" : null,
        vehiculo: estado === "Reservado" ? "Renault Duster" : null,
        patente: estado === "Reservado" ? "AB123CD" : null,
        servicio: estado === "Reservado" ? "Cambio de aceite" : null,
      });
    });
  });

  setTurnos(nuevosTurnos);
}, [selectedDate, setTurnos]);


  const getColor = (estado) => {
    switch (estado) {
      case "Reservado":
        return "#d1d1d1"; 
      case "Disponible":
        return "#ffffff"; 
      case "Contingencia":
        return "#646464ff"; 
      default:
        return "#ffffff";
    }
  };

  const handleCellClick = (estado, hora, estacion, event) => {    
    const fechaStr = formatDateLocal(selectedDate);

    if (estado === "Reservado") {
      const rect = event.target.getBoundingClientRect();
      setPosicionModal({
        top: rect.top + window.scrollY - 10,
        left: rect.right + window.scrollX + 10,
      });
      setTurnoSeleccionado({
        estado,
        hora,
        estacion,
        fecha: fechaStr,
        cliente: "N/A",
        modelo: "N/A",
        patente: "N/A",
        servicio: "N/A",
      });
      setMostrarModal(true);
    } else if (estado === "Disponible") {
      // Navega con fecha formateada correctamente
      navigate("/agendar-turno", {
        state: { hora, estacion, fecha: fechaStr },
      });
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTurnoSeleccionado(null);
  };

  const handleModificar = () => {
     if (!turnoSeleccionado) return;
    navigate("/agendar-turno", { state: { turno: turnoSeleccionado, isEditing: true } });
  };

  const handleCancelar = () => {
    alert("Turno cancelado (simulado).");
    cerrarModal();
  };

   // Cierra el modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        cerrarModal();
      }
    };
    if (mostrarModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarModal]);

  

  return (
    <div className="agenda-container">
      <Header username="Admin" />
      <div className="agenda-content">
        <Sidebar />
        <main className="main-content">
          <div className="agenda-header">
            <h1>Agenda de Turnos</h1>            
          </div>

          <div className="agenda-columns" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>

            {/* Columna izquierda: calendarios */}
            <div className="calendarios-container">
              <DatePicker
                inline
                selected={selectedDate}
                onChange={setSelectedDate}
                minDate={today}
                maxDate={maxDate}
                filterDate={isSelectable}
                openToDate={today}
              />
              <DatePicker
                inline
                selected={selectedDate}
                onChange={setSelectedDate}
                minDate={today}
                maxDate={maxDate}
                filterDate={isSelectable}
                openToDate={new Date(today.getFullYear(), today.getMonth() + 1, 1)}
              />
            </div>

            {/* Columna derecha: tabla */}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Horario</th>
                    {estaciones.map((est, idx) => (
                      <th key={idx}>{est}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horas.map((hora) => {
                    const turnosPorHora = turnos.filter(t => t.hora === hora);

                    return (
                      <tr key={hora}>
                        <td>{hora}</td>
                        {estaciones.map((_, idx) => {
                          if (idx === estaciones.length - 1) return <td key={idx}style={{
                            backgroundColor: getColor("Contingencia"),
                            color: "#fff",
                            textAlign: "center",
                          }}>Contingencia</td>;
                          const t = turnosPorHora[idx]; // toma turno correspondiente
                          const estado = t ? t.estado : "Disponible";

                          return (
                            <td
                              key={idx}
                              style={{
                                backgroundColor: getColor(estado),
                                color: "#0f0606",
                                textAlign: "center",
                                cursor: estado === "Reservado" ? "pointer" : "default",
                                opacity: estado === "Reservado" ? 0.8 : 1,
                              }}
                              onClick={(e) => handleCellClick(
                                estado,
                                hora,
                                `${idx + 1}`,
                                e
                              )}
                            >
                              {estado}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>  


          {/* Modal contextual */}
          {mostrarModal && turnoSeleccionado && (
            <div
              ref={modalRef}
              className="modal-contextual"
              style={{ top: posicionModal.top, left: posicionModal.left }}
            >
              <h2>Detalle del Turno</h2>
              <p><strong>Estado:</strong> {turnoSeleccionado.estado}</p>
              <p><strong>Fecha:</strong> {formatDateForSummary(turnoSeleccionado.fecha)}</p>
              <p><strong>Hora:</strong> {turnoSeleccionado.hora}</p>                
              <p><strong>Cliente:</strong> {turnoSeleccionado.cliente}</p>
              <p><strong>Modelo:</strong> {turnoSeleccionado.modelo}</p>
              <p><strong>Patente:</strong> {turnoSeleccionado.patente}</p>
              <p><strong>Servicio:</strong> {turnoSeleccionado.servicio}</p>              


              <div className="modal-buttons">
                <button className="modalcancel-btn" onClick={handleCancelar}>Cancelar turno</button>
                <button className="modalsave-btn" onClick={handleModificar}>Modificar turno</button>
              </div>
            </div>
          
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Agenda;
