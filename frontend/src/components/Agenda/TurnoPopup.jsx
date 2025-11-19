import React from "react";
import "../../styles/TurnoPopup.css";
import { formatDateForSummary } from "../../utils/dateUtils";


export default function TurnoPopup({ turno, isOpen, onClose, onModificar, onCancelar }) {
  
  if (!isOpen || !turno) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Detalle del Turno</h2>

        <p><strong>Estado:</strong> {turno.estado}</p>
        <p><strong>Fecha:</strong> {formatDateForSummary(turno.fecha)}</p>
        <p><strong>Hora:</strong> {turno.hora}</p>

        {/* Datos del cliente */}
        <p><strong>Cliente:</strong> {turno.cliente ? `${turno.cliente.apellido} ${turno.cliente.nombre}` : "-"}</p>
        <p><strong>Teléfono:</strong> {turno.cliente?.telefono || "-"}</p>

        {/* Datos del vehículo */}
        <p><strong>Vehículo:</strong> {turno.vehiculo ? `${turno.vehiculo.marca} ${turno.vehiculo.modelo}` : "-"}</p>
        <p><strong>Patente:</strong> {turno.vehiculo?.patente || "-"}</p>

        {/* Servicio */}
        <p><strong>Servicio:</strong> {turno.servicio || "-"}</p>

        <div className="popup-buttons">
          <button className="btn-modificar" onClick={onModificar}>Modificar/Cancelar Turno</button>
          
          <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
