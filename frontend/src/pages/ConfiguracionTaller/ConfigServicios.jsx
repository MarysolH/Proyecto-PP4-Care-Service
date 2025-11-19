import React, { useState, useEffect } from "react";
import "../../styles/ConfiguracionTaller.css";
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../../services/serviciosService";

export default function ConfigServicios() {
  const [servicios, setServicios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: "",
    precio: "",
  });

  const [confirmarEliminar, setConfirmarEliminar] = useState({
    visible: false,
    id: null,
    nombre: "",
  });

  const [editando, setEditando] = useState(null);

  // Cargar servicios al inicio
  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    const data = await getServicios();
    setServicios(data);
  };

  const abrirModalNuevo = () => {
    setEditando(null);
    setNuevoServicio({ nombre: "", precio: "" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (servicio) => {
    setEditando(servicio._id);
    setNuevoServicio({
      nombre: servicio.nombre,
      precio: servicio.precio,
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setNuevoServicio({ nombre: "", precio: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoServicio({ ...nuevoServicio, [name]: value });
  };

  const handleGuardar = async () => {
    try {
      if (editando) {
        await updateServicio(editando, {
          nombre: nuevoServicio.nombre,
          precio: Number(nuevoServicio.precio),
        });
      } else {
        await createServicio({
          nombre: nuevoServicio.nombre,
          precio: Number(nuevoServicio.precio),
        });
      }

      cerrarModal();
      await cargarServicios();

    } catch (error) {
      console.error("Error al guardar servicio:", error);
    }
  };

  const handleEliminar = async () => {
    try {
      await deleteServicio(confirmarEliminar.id);
      await cargarServicios();

      setConfirmarEliminar({ visible: false, id: null, nombre: "" });

    } catch (error) {
      console.error("Error al eliminar servicio:", error);
    }
  };

  const abrirConfirmacionEliminar = (servicio) => {
    setConfirmarEliminar({
      visible: true,
      id: servicio._id,
      nombre: servicio.nombre,
    });
  };

  return (
    <div className="config-section">

      <div className="header-servicios">
        <h2>Servicios del Taller</h2>
        <button className="btn-agregar-top" onClick={abrirModalNuevo}>
          + Agregar Servicio
        </button>
      </div>

      <div className="tabla-servicios-container">
        <table className="tabla-servicios sticky-header">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio ($)</th>
              <th style={{ width: "140px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s._id}>
                <td>{s.nombre}</td>
                <td>{s.precio}</td>
                <td>
                  <button className="btn-editar" onClick={() => abrirModalEditar(s)}>
                    Editar
                  </button>
                  <button className="btn-eliminar" onClick={() => abrirConfirmacionEliminar(s)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {servicios.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", color: "#777" }}>
                  No hay servicios cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Modal agregar/editar ---- */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-servicio">
            <h3>{editando ? "Editar Servicio" : "Agregar Servicio"}</h3>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoServicio.nombre}
              onChange={handleChange}
            />

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={nuevoServicio.precio}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button className="btn-guardar" onClick={handleGuardar}>
                Guardar
              </button>
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ---- Modal Confirmación Eliminar ---- */}
      {confirmarEliminar.visible && (
        <div className="modal-overlay">
          <div className="modal-confirmacion">
            <h3>Eliminar servicio</h3>

            <p>
              ¿Seguro que querés eliminar el servicio <b>{confirmarEliminar.nombre}</b>?
            </p>

            <div className="modal-buttons">
              <button
                className="btn-cancelar"
                onClick={() =>
                  setConfirmarEliminar({ visible: false, id: null, nombre: "" })
                }
              >
                Cancelar
              </button>

              <button className="btn-eliminar" onClick={handleEliminar}>
                Sí, eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
