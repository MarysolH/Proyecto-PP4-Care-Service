import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./OrdenesView.css";

// Datos simulados; después se conectará con backend
const ordenesSimuladas = [
  {
    id: 1,
    turnoNumero: "001",
    cliente: "Juan Pérez",
    vehiculo: "Renault Duster",
    estado: "FINALIZADO",
    horaIngreso: "10:00",
    estacion: "2",
  },
  {
    id: 2,
    turnoNumero: "002",
    cliente: "Ana López",
    vehiculo: "Renault Arkana",
    estado: "EN CURSO",
    horaIngreso: "10:30",
    estacion: "1",
  },
  {
    id: 3,
    turnoNumero: "003",
    cliente: "Carlos Gómez",
    vehiculo: "Renault Kwid",
    estado: "PENDIENTE",
    horaIngreso: "11:00",
    estacion: "3",
  },
];

function OrdenesView() {
  const navigate = useNavigate();

  const handleVerDetalle = (orden) => {
    navigate("/detalle-orden", { state: { orden } });
  };

  return (
    <div className="ordenes-view-page">
  <Header username="Admin" />
  <div className="ordenes-view-content">
    <Sidebar/>
    <main className="ordenes-view-main">
      <h1 className="ordenes-view-title">Estado Ordenes Taller</h1>

      <div className="ordenes-view-tabla-container">
        <table className="ordenes-view-table">
          <thead>
            <tr>
              <th>Turno N°</th>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Estado</th>
              <th>Hora Ingreso</th>
              <th>Estación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordenesSimuladas.map((orden) => (
              <tr key={orden.id}>
                <td>{orden.turnoNumero}</td>
                <td>{orden.cliente}</td>
                <td>{orden.vehiculo}</td>
                <td className={`estado-orden ${orden.estado.replace(" ", "-")}`}>
                  {orden.estado}
                </td>
                <td>{orden.horaIngreso}</td>
                <td>{orden.estacion}</td>
                <td>
                  <button className="detalle-btn"onClick={() => handleVerDetalle(orden)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  </div>
  <Footer />
</div>

  );
}

export default OrdenesView;
