import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

import { useTurnos} from "../context/TurnosContext";
import { formatDateForSummary } from "../utils/dateUtils";
import "../styles/TurnosView.css";

function TurnosView() {
  const navigate = useNavigate();
  const { turnos, refreshTurnos, loading } = useTurnos();

  const location = useLocation();
  const turnoConOrden = location.state?.turnoConOrden;


  const [filtros, setFiltros] = useState({
    fecha: "",
    hora: "",
    estacion: "",
    servicio: "",
    estado: "",
  });

  useEffect(() => {
    refreshTurnos(); // carga los turnos al abrir la vista
  }, []);  

  const clienteNombre = (t) => t.cliente?.nombre || t.nombre || "";
  const clienteApellido = (t) => t.cliente?.apellido || t.apellido || "";
  const clienteTelefono = (t) => t.cliente?.telefono || t.telefono || "";
  const clienteEmail = (t) => t.cliente?.email || t.correo || "";

  const vehiculoMarca = (t) => t.vehiculo?.marca || t.marca || "";
  const vehiculoModelo = (t) => t.vehiculo?.modelo || t.modelo || "";
  const vehiculoPatente = (t) => t.vehiculo?.patente || t.patente || "";

  // Manejo de filtros
  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };
  
  const turnosFiltrados = turnos.filter((t) => {
    const estado = String(t.estado || "").toLowerCase();
    const filtroEstado = String(filtros.estado || "").toLowerCase();
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

  // --- Convertimos turnos cancelados en disponibles
  const turnosVisibles = turnosOrdenados.map((t) => {
    if (t.estado === "Cancelado") {
      return { ...t, estado: "Disponible", fueCancelado: true};
    }


    return t;
  });

  // Navegaciones
  const handleModificar = (t) => {
    const turnoParaEditar = {
      _id: t._id,
      cliente: t.cliente || null,
      vehiculo: t.vehiculo || null,
      nombre: clienteNombre(t),
      apellido: clienteApellido(t),
      correo: clienteEmail(t),
      telefono: clienteTelefono(t),
      patente: vehiculoPatente(t),
      marca: vehiculoMarca(t),
      modelo: vehiculoModelo(t),
      anio: t.vehiculo?.anio || t.anio || "",
      servicio: t.servicio,
      fecha: t.fecha,
      hora: t.hora,
      estacion: t.estacion,
      observaciones: t.observaciones || "",
      estado: t.estado,
    };

    navigate("/agendar-turno", {
      state: { turno: turnoParaEditar, isEditing: true, from: "turnos" },
    });
  };

  const handleReservar = (turno) => {
    navigate("/agendar-turno", {
      state: {
        hora: turno.hora,
        estacion: turno.estacion,
        fecha: turno.fecha,
        from: "turnos" 
      },
    });
  };

  const handleGenerarOT = (t) => {
    navigate("/orden-trabajo", { state: { turno: t } });
  };

   useEffect(() => {
    if (location.state?.updated) {
      console.log("↩ Regresaste desde AgendarTurno → refrescando turnos");
      refreshTurnos();

      // Limpiar flag para no repetir refresco
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Render principal
  return (
    <div className="turnos-page">
      <div className="header-fixed">
        <Header username="Admin" />
      </div>

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
                    "accion"
                  ].map((campo) => (
                    <th key={campo}>
                      {campo.charAt(0).toUpperCase() + campo.slice(1)}
                    </th>
                  ))}                 
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
                      {[1, 2, 3, 4, 5].map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th colSpan="4"></th>                  
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
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="sin-resultados">
                      Cargando turnos...
                    </td>
                  </tr>
                ) : turnosVisibles.length > 0 ? (
                  turnosVisibles.map((t) => (
                    <tr
                      key={t._id || t.id}
                      className={
                        t.fueCancelado
                          ? "fila-cancelado"
                          : t.estado === "Reservado"
                          ? "fila-reservado"
                          : "fila-disponible"
                      }
                    >
                      <td>{formatDateForSummary(t.fecha)}</td>
                      <td>{t.hora}</td>
                      <td>{t.estacion}</td>
                      <td>{clienteNombre(t) ? `${clienteNombre(t)} ${clienteApellido(t)}` : "-"}</td>
                      <td>{clienteTelefono(t) || "-"}</td>
                      <td>{vehiculoMarca(t) ? `${vehiculoMarca(t)} ${vehiculoModelo(t)}` : "-"}</td>
                      <td>{vehiculoPatente(t) || "-"}</td>
                      <td>{t.servicio || "-"}</td>
                      <td>
                        <span className={`estado ${String(t.estado).toLowerCase()}`}>
                          {t.fueCancelado ? "Cancelado" : t.estado}
                        </span>
                      </td>
                      <td>
                        {t.estado === "Reservado" ? (
                          <>
                            <button className="btn-ver" onClick={() => handleModificar(t)}>
                              Modificar
                            </button>
                            {t.ordenGenerada || t.estado === "En taller" || t._id === turnoConOrden ? (
                              <button className="btn-taller" disabled>
                                En taller
                              </button>
                            ) : (
                              <button className="btn-ot" onClick={() => handleGenerarOT(t)}>
                                Generar OT
                              </button>
                            )}
                          </>
                        ) : (
                          <button className="btn-reservar" onClick={() => handleReservar(t)}>
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
