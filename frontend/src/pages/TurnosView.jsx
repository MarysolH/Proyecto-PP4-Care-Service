import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useTurnos } from "../context/TurnosContext";
import "./TurnosView.css";

function TurnosView() {
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    fecha: "",
    hora: "",
    estacion: "",
    servicio: "",
    estado: "",
  });

  const { turnos } = useTurnos();

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // --- FILTRADO ---
  const turnosFiltrados = turnos.filter((t) => {
    return (
      (!filtros.fecha || t.fecha === filtros.fecha) &&
      (!filtros.hora || t.hora === filtros.hora) &&
      (!filtros.estacion || t.estacion === filtros.estacion) &&
      (!filtros.servicio ||
        (t.servicio &&
          t.servicio.toLowerCase().includes(filtros.servicio.toLowerCase()))) &&
      (!filtros.estado || t.estado === filtros.estado)
    );
  });

  // --- ORDEN FIJO: fecha → hora → estación ---
  const turnosOrdenados = [...turnosFiltrados].sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha > b.fecha ? 1 : -1;
    if (a.hora !== b.hora) return a.hora > b.hora ? 1 : -1;
    return a.estacion > b.estacion ? 1 : -1;
  });

  const handleReservar = (turno) => {
    navigate("/agendar-turno", {
      state: {
        hora: turno.hora,
        estacion: turno.estacion,
        fecha: turno.fecha,
      },
    });
  };

  const handleModificar = (t) => {
    navigate("/agendar-turno", {
      state: { turno: t, isEditing: true },
    });
  };

  const handleGenerarOT = (t) => {
    navigate("/orden-trabajo", { state: { turno: t } });
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  return (
    <div className="turnos-page">
      <Header username="Admin" />
      <div className="turnos-content">
        <Sidebar />
        <main className="turnos-main">
          <h1 className="turnos-title">Gestión de Turnos</h1>

          <div className="tabla-container">
            <table className="tabla-turnos">
              <thead>
                <tr>
                  {[
                    "fecha",
                    "hora",
                    "estacion",
                    "cliente",
                    "telefono",
                    "vehiculo",
                    "patente",
                    "servicio",
                    "estado",
                  ].map((campo) => (
                    <th key={campo}>
                      {campo.charAt(0).toUpperCase() + campo.slice(1)}
                    </th>
                  ))}
                  <th>Acción</th>
                </tr>

                {/* FILTROS EN CABECERA */}
                <tr className="filtros-header">
                  <th>
                    <input
                      type="date"
                      name="fecha"
                      value={filtros.fecha}
                      onChange={handleChange}
                    />
                  </th>
                  <th>
                    <select
                      name="hora"
                      value={filtros.hora}
                      onChange={handleChange}
                    >
                      <option value="">Todas</option>
                      {[9, 10, 11, 12, 13, 14, 15, 16].map((h) => {
                        const horaFormateada = `${h.toString().padStart(2, "0")}:00`;
                        return (
                          <option key={h} value={horaFormateada}>
                            {horaFormateada}
                          </option>
                        );
                      })}
                    </select>
                  </th>
                  <th>
                    <select
                      name="estacion"
                      value={filtros.estacion}
                      onChange={handleChange}
                    >
                      <option value="">Todas</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>

                    </select>
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <input
                      type="text"
                      name="servicio"
                      placeholder="Servicio..."
                      value={filtros.servicio}
                      onChange={handleChange}
                    />
                  </th>
                  <th>
                    <select
                      name="estado"
                      value={filtros.estado}
                      onChange={handleChange}
                    >
                      <option value="">Todos</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Reservado">Reservado</option>
                    </select>
                  </th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {turnosOrdenados.length > 0 ? (
                  turnosOrdenados.map((t) => (
                    <tr
                      key={t.id}
                      className={
                        t.estado === "Reservado"
                          ? "fila-reservado"
                          : "fila-disponible"
                      }
                    >
                      <td>{formatDate(t.fecha)}</td>
                      <td>{t.hora}</td>
                      <td>{t.estacion}</td>
                      <td>{t.nombre ? `${t.nombre} ${t.apellido}` : "-"}</td>
                      <td>{t.telefono || "-"}</td>
                      <td>{t.marca ? `${t.marca} ${t.modelo}` : "-"}</td>
                      <td>{t.patente || "-"}</td>
                      <td>{t.servicio || "-"}</td>
                      <td>
                        <span className={`estado ${t.estado.toLowerCase()}`}>
                          {t.estado}
                        </span>
                      </td>
                      <td>
                        {t.estado === "Reservado" ? (
                          <>
                            <button
                              className="btn-ver"
                              onClick={() => handleModificar(t)}
                            >
                              Modificar
                            </button>
                            <button
                              className="btn-ot"
                              onClick={() => handleGenerarOT(t)}
                            >
                              Generar OT
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn-reservar"
                            onClick={() => handleReservar(t)}
                          >
                            Reservar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="sin-resultados">
                      No se encontraron turnos.
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

export default TurnosView;
