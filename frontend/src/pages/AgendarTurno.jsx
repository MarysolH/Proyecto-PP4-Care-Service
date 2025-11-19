import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useTurnos } from "../context/TurnosContext";
import { createTurno, updateTurno, cancelarTurno } from "../services/turnosService";
import { getServicios } from "../services/serviciosService";
import { getVehiculos } from "../services/vehiculosService";


import "../styles/AgendarTurno.css";

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
  const navigate = useNavigate();
  const location = useLocation();

  const { turnos, setTurnos, fetchTurnos } = useTurnos();
  const { turno, isEditing } = location.state || {};

  const from = location.state?.from || "agenda";

  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);

  const { user } = useContext(UserContext);
  const token = user?.token;

  const [confirmarCancelacion, setConfirmarCancelacion] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); 

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    patente: "",
    marca: "",
    modelo: "",
    anio: "",
    servicio: "",
    fecha: "",
    hora: "",
    estacion: "",
    observaciones: "",
  });

  const [errorFecha, setErrorFecha] = useState("");

  // Carga inicial de servicios y vehículos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehs = await getVehiculos();
        setVehiculos(vehs);

        const servs = await getServicios();
        setServicios(servs);
      } catch (error) {
        console.error("Error cargando vehículos o servicios:", error);
      }
    };
    fetchData();
  }, []);

  // Completa formulario en edición o con hora/fecha pasada por location.state
  useEffect(() => {
    if (isEditing && turno) {
      setFormData({
        nombre: turno.cliente?.nombre || "",
        apellido: turno.cliente?.apellido || "",
        correo: turno.cliente?.email || "",
        telefono: turno.cliente?.telefono || "",
        patente: turno.vehiculo?.patente || "",
        marca: turno.vehiculo?.marca || "",
        modelo: turno.vehiculo?.modelo || "",
        anio: turno.vehiculo?.anio || "",
        servicio: turno.servicio || "",
        fecha: formatDateLocal(turno.fecha),
        hora: turno.hora || "",
        estacion: turno.estacion || "",
        observaciones: turno.observaciones || "",
      });

    } else if (location.state?.fecha && location.state?.hora) {
        const { fecha, hora, estacion } = location.state;
        setFormData((prev) => ({
          ...prev,
          fecha: formatDateLocal(fecha),
          hora,
          estacion: estacion || "",
        }));
      }
  }, [isEditing, turno, location.state]);

 
 

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCancelar = () => navigate("/agenda");

  const handleGuardar = async () => {
    const hoy = new Date();
    const [y, m, d] = formData.fecha.split("-");
    const fechaSeleccionada = new Date(y, m - 1, d);
    const maxFecha = new Date();
    maxFecha.setDate(hoy.getDate() + 14);

    setErrorFecha("");

    // Validaciones de fecha
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

    // Construimos el objeto según el schema de Mongoose
    const nuevoTurno = {
      cliente: {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.correo,
        telefono: formData.telefono,
      },
      vehiculo: {
        patente: formData.patente,
        marca: formData.marca,
        modelo: formData.modelo,
        anio: formData.anio,
      },
      servicio: formData.servicio,
      fecha: formData.fecha,
      hora: formData.hora,
      estacion: formData.estacion,
      observaciones: formData.observaciones,
      estado: isEditing ? turno.estado : "Reservado",
    };

    try {
      let turnoGuardado;

      if (!isEditing) {
        // Crear nuevo turno
        turnoGuardado = await createTurno(nuevoTurno);
        if (!turnoGuardado) {
          setTipoMensaje("error");
          setMensaje("Ocurrió un error al guardar el turno.");
          return;
        }

        setTipoMensaje("exito");
        setMensaje("Turno guardado correctamente.");

              
      } else {
        // Editar turno existente
        console.log("Enviando updateTurno:", turno._id, nuevoTurno);
        turnoGuardado = await updateTurno(turno._id, nuevoTurno, token);

        if (!turnoGuardado) {
          setTipoMensaje("error");
          setMensaje("Ocurrió un error al actualizar el turno en el servidor.");
          return;
        }

        setTipoMensaje("exito");
        setMensaje("Turno actualizado correctamente.");        
      }

      // Oculta el mensaje luego de 3 segundos y vuelve a Agenda
      setTimeout(() => {
        setMensaje("");
        if (from === "turnos") {
          navigate("/turnos-view", { state: { updated: true } });
        } else {
          navigate("/agenda", { state: { updated: true } });
        }
      }, 3000);

    } catch (error) {
      console.error("Error al guardar el turno:", error);
      setTipoMensaje("error");
      setMensaje("Error inesperado al guardar el turno.");
      setTimeout(() => setMensaje(""), 3000);
      }
  };


  const handleCancelarTurno = async () => {
        // Si está editando y existe el turno
    if (isEditing && turno?._id) {
      try {
        const cancelado = await cancelarTurno(turno._id);

        if (cancelado) {
          setTipoMensaje("exito");
          setMensaje("Turno cancelado correctamente.");
         
          // Refrescamos los turnos desde el backend para mantenerlos actualizados
          if (typeof fetchTurnos === "function") {
            await fetchTurnos();
          }
          setTimeout(() => {
            setMensaje("");
            navigate("/agenda");
          }, 2000);
        } else {
          setTipoMensaje("error");
          setMensaje("Error al cancelar el turno.");
        }
      } catch (error) {
        console.error("Error al cancelar el turno:", error);
        setTipoMensaje("error");
        setMensaje("Ocurrió un error al cancelar el turno.");
      }
    }
  };
  // Filtra modelos según marca seleccionada
  const modelosDisponibles = formData.marca
    ? vehiculos.find((v) => v.marca === formData.marca)?.modelos || []
    : [];

  // Filtra años según modelo seleccionado
  const aniosDisponibles = formData.modelo
    ? modelosDisponibles.find((m) => m.nombre === formData.modelo)?.años || []
    : [];

  return (
    <div className="agendar-page">
      <Header username="Admin" />
      <div className="agendar-content">
        <Sidebar />
        <main className="main-content">
          <h1>{isEditing ? "Modificar Turno" : "Agendar Turno"}</h1>

          <div className="agendar-container">
            <div className="form-section">
              <h2>Datos del Cliente</h2>
              <div className="form-group">
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
              </div>
              <div className="form-group">
                <input type="email" name="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} />
                <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
              </div>

              <h2>Datos del Vehículo</h2>
              <div className="form-group">
                <input type="text" name="patente" placeholder="Patente" value={formData.patente} onChange={handleChange} />

                <select name="marca" value={formData.marca} onChange={handleChange}>
                  <option value="">Marca</option>
                  {vehiculos.map((v) => (
                    <option key={v._id} value={v.marca}>{v.marca}</option>
                  ))}
                  <option value="Otro">Otro</option>
                </select>

                <select name="modelo" value={formData.modelo} onChange={handleChange} disabled={!formData.marca}>
                  <option value="">Modelo</option>
                  {modelosDisponibles.map((m) => (
                    <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
                  ))}
                </select>

                <select name="anio" value={formData.anio} onChange={handleChange} disabled={!formData.modelo}>
                  <option value="">Año</option>
                  {aniosDisponibles.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <h2>Servicio Solicitado</h2>
              <div className="form-group">
                <select name="servicio" value={formData.servicio} onChange={handleChange}>
                  <option value="">Seleccione un servicio</option>
                  {servicios.map((s) => (
                    <option key={s._id} value={s.nombre}>{s.nombre}</option>
                  ))}
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
                <input type="time" name="hora" value={formData.hora} onChange={handleChange} />
                <input type="text" name="estacion" placeholder="Estación asignada" value={formData.estacion} onChange={handleChange} />
              </div>

              {errorFecha && (
                <div className="error-modal">
                  <p>{errorFecha}</p>
                  <button onClick={() => setErrorFecha("")}>X</button>
                </div>
              )}

              <h2>Observaciones</h2>
              <textarea name="observaciones" placeholder="Escriba observaciones adicionales..." value={formData.observaciones} onChange={handleChange} rows={4}></textarea>
            </div>

            <div className="summary-section">
              <h2>Resumen del Turno</h2>
              <p><strong>Cliente:</strong> {formData.nombre} {formData.apellido}</p>
              <p><strong>Teléfono:</strong> {formData.telefono}</p>
              <p><strong>Correo:</strong> {formData.correo}</p>
              <p><strong>Vehículo:</strong> {formData.marca} {formData.modelo} ({formData.anio})</p>
              <p><strong>Patente:</strong> {formData.patente}</p>
              <p><strong>Servicio:</strong> {formData.servicio}</p>
              <p><strong>Fecha:</strong> {formatDateForSummary(formData.fecha)}</p>
              <p><strong>Hora:</strong> {formData.hora}</p>
              <p><strong>Estación:</strong> {formData.estacion}</p>
            </div>
          </div>

          {mensaje && (
              <div className={`mensaje-flotante unificado ${tipoMensaje === "exito" ? "exito" : "error"}`}>
                {mensaje}
              </div>
          )}
          {/* Mensaje flotante para confirmación de cancelación */}
          {confirmarCancelacion && (
            <div className="overlay">
              <div className="confirm-modal">
                <p>¿Está seguro que desea cancelar el turno?</p>
                <div className="modal-buttons">
                  <button
                    className="confirm-btn"
                    onClick={async () => {
                      setConfirmarCancelacion(false);
                      await handleCancelarTurno();
                    }}
                  >
                    Sí, cancelar
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setConfirmarCancelacion(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}


          <div className="buttons">
            <button className="cancel-btn" onClick={handleCancelar}>Cancelar</button>
            {isEditing && !confirmarCancelacion && (
              <button className="cancel-turno-btn" onClick={() => setConfirmarCancelacion(true)}>
                Cancelar turno
              </button>
            )}
            <button className="save-btn" onClick={handleGuardar}>
              {isEditing ? "Guardar cambios" : "Guardar turno"}
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AgendarTurno;
