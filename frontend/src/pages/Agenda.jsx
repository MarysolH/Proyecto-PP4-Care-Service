import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Componentes UI
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import TurnoPopup from "../components/Agenda/TurnoPopup";


// Contexto y servicios
import { useTurnos } from "../context/TurnosContext";
import { cancelarTurno } from "../services/turnosService";

// Utils
import { formatDateLocal, getColor } from "../utils/dateUtils";

// Estilos
import "../styles/Agenda.css";


function Agenda() {
  const navigate = useNavigate();
  const { turnos: ctxTurnos, refreshTurnos, loading } = useTurnos() || {};
  
  const turnos = Array.isArray(ctxTurnos) ? ctxTurnos : [];

  // Configuración fechas
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 14);
  const isSelectable = (date) => date.getDay() !== 0;

  // Estados locales
  const [selectedDate, setSelectedDate] = useState(today);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  
  // Datos fijos
  const horas = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];
  const estaciones = ["1", "2", "3", "4", "5"];

  // Cargar turnos 
  useEffect(() => {
    if (typeof refreshTurnos === "function") {
      refreshTurnos();
    }
  }, [selectedDate]); 

  // Filtrar turnos del día seleccionado
  const fechaSeleccionadaStr = formatDateLocal(selectedDate);
  const turnosDelDia = turnos.filter(
    (t) => t && t.fecha === fechaSeleccionadaStr && t.estado !== "Cancelado"
  );

  // Abrir/crear turno
  const handleCellClick = (turno, hora, estacion) => {
    const fechaStr = fechaSeleccionadaStr;
    if (estacion === "5") return; // Contingencia, no clickeable

      // Si el turno está reservado
    if (turno && turno.estado === "Reservado") {
      // Evita reabrir el modal si ya está abierto para el mismo turno
      if (isModalOpen && turnoSeleccionado?.id === turno.id) return;

      setTurnoSeleccionado(turno);
      setIsModalOpen(true);
      return;
    }
    // Si no hay turno reservado, navegar a agendar
    navigate("/agendar-turno", { state: { hora, estacion, fecha: fechaStr } });
  };

  // Cerrar modal
  const cerrarModal = () => {
    setIsModalOpen(false);
    setTurnoSeleccionado(null);
  };

  // Modificar turno
  const handleModificar = () => {
    if (!turnoSeleccionado) return;

    navigate("/agendar-turno", {
      state: { turno: turnoSeleccionado, isEditing: true },
    });
    cerrarModal();
  };

  // Cancelar turno
  const handleCancelar = async (idTurno) => {
    if (!idTurno) return;

    setMensaje("Cancelando turno...");
    setTipoMensaje("info");

    try {
      const cancelado = await cancelarTurno(idTurno);

      if (cancelado) {
        setMensaje("Turno cancelado correctamente.");
        setTipoMensaje("exito");
        if (typeof refreshTurnos === "function") await refreshTurnos();
        cerrarModal();
      } else {
        setMensaje("Error al cancelar el turno.");
        setTipoMensaje("error");
      }
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
      setMensaje("Ocurrió un error al cancelar el turno.");
      setTipoMensaje("error");
    } finally {
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  // Loading
  if (loading) return <p>Cargando turnos...</p>;
  
  

  // Render principal
  return (
    <div className="agenda-container">
      <Header username="Admin" />
      <div className="agenda-content">
        <Sidebar />

        <main className="main-content">
          <div className="agenda-header">
            <h1>Agenda de Turnos</h1>
          </div>

          {/* Mensaje de estado */}
          {mensaje && (
            <div
              className={`mensaje ${tipoMensaje}`}
              style={{
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
                textAlign: "center",
                color: tipoMensaje === "exito" ? "#155724" : "#721c24",
                backgroundColor: tipoMensaje === "exito" ? "#d4edda" : "#f8d7da",
                border: tipoMensaje === "exito" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
                fontWeight: "500",
              }}
            >
              {mensaje}
            </div>
          )}

          {/* Contenido principal */}
          <div
            className="agenda-columns"
            style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}
          >
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

            {/* Tabla de turnos */}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Horario</th>
                    {estaciones.map((est) => (
                      <th key={est}>Estación {est}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horas.map((hora) => (
                    <tr key={hora}>
                      <td>{hora}</td>
                      {estaciones.map((estacion) => {
                        const turno = turnosDelDia.find(
                          (t) => t.hora === hora && t.estacion === estacion
                        );
                        const estado = turno ? turno.estado : "Disponible";

                        if (estacion === "5") {
                          return (
                            <td key={estacion} className="columna-contingencia">
                              Contingencia
                            </td>
                          );
                        }

                        return (
                          <td
                            key={estacion}
                            style={{
                              backgroundColor: getColor(estado),
                              textAlign: "center",
                              cursor: "pointer",
                              opacity: estado === "Reservado" ? 0.8 : 1,
                            }}
                            onClick={() => handleCellClick(turno, hora, estacion)}
                          >
                            {estado}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal del detalle  */}
          
          <TurnoPopup
            isOpen={isModalOpen}
            turno={turnoSeleccionado}
            onClose={cerrarModal}
            onModificar={handleModificar}
            onCancelar={handleCancelar}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Agenda;
