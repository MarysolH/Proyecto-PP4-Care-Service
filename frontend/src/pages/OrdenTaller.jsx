import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { getOrdenById, createOrden, actualizarOrden } from "../services/ordenesService";
import { useOrdenes } from "../context/OrdenesContext";
import { getServicios } from "../services/serviciosService";

import "../styles/OrdenTaller.css";

function OrdenTaller() {
  const location = useLocation();
  const mecanico = location.state?.mecanico || "Taller";
  const navigate = useNavigate();
  const { actualizarOrden: actualizarOrdenContext } = useOrdenes();

  const ordenRecibida = location.state?.orden;
  const ordenId = location.state?.orden?._id || location.state?.ordenId || null;

  const [orden, setOrden] = useState(ordenRecibida || null);
  const [loading, setLoading] = useState(!ordenRecibida);
  const [estadoOrden, setEstadoOrden] = useState("PENDIENTE");

  const [servicioRealizado, setServicioRealizado] = useState(null);
  const [serviciosAdicionales, setServiciosAdicionales] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState("");
  const [puntosControl, setPuntosControl] = useState(null);
  const [horaIngreso, setHoraIngreso] = useState("");
  const [estacionAsignada, setEstacionAsignada] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEnviadoModal, setShowEnviadoModal] = useState(false);
  const [listaServicios, setListaServicios] = useState([]);


  useEffect(() => {
  const cargarServicios = async () => {
    try {
      const data = await getServicios();
      setListaServicios(data);
    } catch (err) {
      console.error("Error cargando servicios:", err);
    }
  };

  cargarServicios();
}, []);

  // Fetch orden si viene solo el ID
  useEffect(() => {
    const fetchOrden = async () => {
      if (!orden && ordenId) {
        try {
          setLoading(true);
          const data = await getOrdenById(ordenId);
          if (data) {
            setOrden(data);
            setEstadoOrden(data.estado || "PENDIENTE");
            setHoraIngreso(data.horaIngreso || "");
            setEstacionAsignada(data.estacion || "");
            setComentarios(data.comentarios || "");
          }
        } catch (error) {
          console.error("Error al cargar orden:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrden();
  }, [ordenId]);


  

  // Actualiza orden en contexto cada vez que cambia
  useEffect(() => {
  if (!orden) return;
  actualizarOrdenContext({
    ...orden,
    estado: estadoOrden,
    horaIngreso,
    estacion: estacionAsignada,
    comentarios,
    servicioRealizado,
    serviciosAdicionales,
    puntosControl,
  });
}, [estadoOrden, horaIngreso, estacionAsignada, comentarios, servicioRealizado, serviciosAdicionales, puntosControl]);

  if (loading) return <p className="orden-loading">Cargando orden...</p>;

  const baseOrden = ordenRecibida || orden;

  const ordenNormalizada = baseOrden
    ? {
        ...baseOrden,
        fecha:
          baseOrden.fecha ||
          baseOrden.fechaTurno ||
          baseOrden.fechaIngreso ||
          baseOrden.createdAt ||
          "-",
        cliente: baseOrden.cliente || {
          nombre: baseOrden.cliente?.nombre || baseOrden.clienteNombre || "-",
          apellido: baseOrden.cliente?.apellido || baseOrden.clienteApellido || "",
          telefono: baseOrden.cliente?.telefono || baseOrden.telefono || "-",
        },
        vehiculo: baseOrden.vehiculo || {
          marca: baseOrden.vehiculo?.marca || baseOrden.vehiculoMarca || "-",
          modelo: baseOrden.vehiculo?.modelo || baseOrden.vehiculoModelo || "-",
          anio: baseOrden.vehiculo?.anio || baseOrden.vehiculoAnio || "-",
          patente: baseOrden.vehiculo?.patente || baseOrden.patente || "-",
        },
      }
    : null;

  const ordenFallback = {
    numero: "001",
    fecha: "2025-10-10",
    hora: "10:00",
    estacion: "2",
    cliente: { nombre: "Juan", apellido: "Pérez", telefono: "1123456789" },
    vehiculo: { marca: "Renault", modelo: "Duster", anio: "2020", patente: "AB123CD" },
    servicio: "Cambio de aceite",
  };

  const ordenActiva = ordenNormalizada || ordenFallback;

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

  const handleEnviarAFacturar = async () => {
    if (servicioRealizado === null) {
      setShowModal(true);
      return;
    }

    const ordenParaActualizar = {
      ...orden,
      estado: "FINALIZADO",
      horaIngreso: horaIngreso || orden.horaIngreso || "",
      estacion: estacionAsignada || orden.estacion || "",
      comentarios,
      servicioRealizado,
      serviciosAdicionales: serviciosAdicionales.map((s) => ({ nombre: s, realizado: true })),
      puntosControl: puntosControl ? [{ nombre: "Control General", realizado: true }] : [],
    };

    try {
      let ordenActualizada;

      if (orden._id) {
        // ✅ Aquí pasamos ID y datos, nunca undefined
        ordenActualizada = await actualizarOrden(orden._id, ordenParaActualizar);
      } else {
        ordenActualizada = await createOrden(ordenParaActualizar);
      }

      if (!ordenActualizada) {
        console.error("No se pudo actualizar o crear la orden");
        return;
      }

      setOrden(ordenActualizada);
      actualizarOrdenContext(ordenActualizada);

      setShowEnviadoModal(true);
      setTimeout(() => {
        setShowEnviadoModal(false);
        navigate("/listado-ordenes");
      }, 2000);
    } catch (err) {
      console.error("Error actualizando orden:", err);
    }
  };


  const handleVolver = () => navigate("/taller");

  return (
    <div className="taller-page">
      <Header username={mecanico} />
      <main className="taller-main">
        <h1 className="taller-title">Orden de Trabajo - Taller</h1>

        {/* DATOS DEL TURNO */}
        <div className="orden-card datos-turno">
          <div className="columna">
            <p><strong>Fecha:</strong> {ordenActiva.fecha ? new Date(ordenActiva.fecha).toLocaleDateString() : "-"}</p>
            <p><strong>Hora:</strong> {ordenActiva.hora || ordenActiva.horaIngreso || "-"}</p>
            <p><strong>Estación N°:</strong> {ordenActiva.estacion || ordenActiva.estacionAsignada || "-"}</p>
            <p><strong>Servicio:</strong> {ordenActiva.servicio || "-"}</p>
          </div>
          <div className="columna">
            <p><strong>Cliente:</strong> {`${ordenActiva.cliente?.nombre} ${ordenActiva.cliente?.apellido}`}</p>
            <p><strong>Teléfono:</strong> {ordenActiva.cliente?.telefono || "-"}</p>
            <p><strong>Vehículo:</strong> {`${ordenActiva.vehiculo?.marca} ${ordenActiva.vehiculo?.modelo} (${ordenActiva.vehiculo?.anio})`}</p>
            <p><strong>Patente:</strong> {ordenActiva.vehiculo?.patente || "-"}</p>
          </div>
        </div>

        {/* ESTADO DE LA ORDEN */}
        <div className="orden-card estado-orden">
          {estados.map((estado) => (
            <div
              key={estado.nombre}
              className={`estado-boton ${estadoOrden === estado.nombre ? "activo" : ""}`}
              style={{ borderColor: estado.color }}
              onClick={() => setEstadoOrden(estado.nombre)}
            >
              <span className="circulo-estado" style={{ backgroundColor: estado.color }}></span>
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
                <span>{ordenActiva.servicio}</span>
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
                <select value={nuevoServicio} onChange={(e) => setNuevoServicio(e.target.value)}>
                  <option value="">Seleccionar</option>

                  {listaServicios.length > 0 ? (
                    listaServicios.map((serv) => (
                      <option key={serv._id} value={serv.nombre}>
                        {serv.nombre}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay servicios cargados</option>
                  )}
                </select>
                <button type="button" onClick={agregarServicio}>Agregar</button>
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
                    {s} <button type="button" onClick={() => eliminarServicio(i)}>✖</button>
                  </div>
                ))
              ) : (
                <div className="item-servicio vacio">Se listan los adicionales agregados (x para eliminarlos)</div>
              )}
            </div>
          </div>

          <div className="fila-puntos-control">
            <label className="link-puntos-control" onClick={() => navigate("/puntos-control-view")} style={{ cursor: "pointer" }}>
              PUNTOS DE CONTROL (Realizado)
            </label>
            <button type="button" className={puntosControl === true ? "activo-ok" : ""} onClick={() => setPuntosControl(true)}>✔</button>
            <button type="button" className={puntosControl === false ? "activo-no" : ""} onClick={() => setPuntosControl(false)}>✖</button>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="accion-botones">
          <button className="volver-btn" onClick={handleVolver}>Volver al Taller</button>
          <button className="volver-btn" onClick={() => navigate("/listado-ordenes")}>Ver Listado</button>
          <button className="volver-btn" onClick={handleEnviarAFacturar}>Enviar a Administración</button>
        </div>
      </main>

      {/* MODALES */}
      {showModal && (
        <div className="orden-taller-modal-overlay">
          <div className="orden-taller-modal">
            <h2>Atención</h2>
            <p>Debes marcar si el servicio se realizó o no antes de continuar.</p>
            <button onClick={() => setShowModal(false)}>Aceptar</button>
          </div>
        </div>
      )}
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
