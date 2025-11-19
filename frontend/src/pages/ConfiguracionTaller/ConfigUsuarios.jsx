import React, { useEffect, useState } from "react";
import "../../styles/ConfiguracionTaller.css";

import {
  getUsuarios,
  updateUsuario,
  deleteUsuario,
  changeUserRole,
  toggleUsuarioActivo,
} from "../../services/usuariosService";
import { registerUser } from "../../services/authService";

export default function ConfigUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalRolAbierto, setModalRolAbierto] = useState(false);

  const [confirmarEliminar, setConfirmarEliminar] = useState({
    visible: false,
    id: null,
    nombre: "",
  });

  const [editando, setEditando] = useState(null);

  const [formUsuario, setFormUsuario] = useState({
    apellido: "",
    nombre: "",
    usuario: "",
    password: "",
    rol: "administrativo",
  });

  const [nuevoRol, setNuevoRol] = useState("administrativo");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const abrirModalNuevo = () => {
    setEditando(null);
    setFormUsuario({
      apellido: "",
      nombre: "",
      usuario: "",
      password: "",
      rol: "administrativo",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (u) => {
    setEditando(u._id);
    setFormUsuario({
      apellido: u.apellido,
      nombre: u.nombre,
      usuario: u.usuario,
      password: "",
      rol: u.rol,
    });
    setModalAbierto(true);
  };

  const abrirModalRol = (u) => {
    setUsuarioSeleccionado(u);
    setNuevoRol(u.rol);
    setModalRolAbierto(true);
  };

  const cerrarModales = () => {
    setModalAbierto(false);
    setModalRolAbierto(false);
    setEditando(null);
    setUsuarioSeleccionado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    try {
      if (editando) {
        await updateUsuario(editando, {
          apellido: formUsuario.apellido,
          nombre: formUsuario.nombre,
          usuario: formUsuario.usuario,
          rol: formUsuario.rol,
        });
      } else {
        await registerUser({
          apellido: formUsuario.apellido,
          nombre: formUsuario.nombre,
          usuario: formUsuario.usuario,
          password: formUsuario.password,
          rol: formUsuario.rol,
        });
      }

      cerrarModales();
      cargarUsuarios();
    } catch (err) {
      console.error("Error guardando usuario:", err);
    }
  };

  const confirmarEliminarUsuario = (u) => {
    setConfirmarEliminar({
      visible: true,
      id: u._id,
      nombre: u.nombre,
      apellido: u.apellido,
    });
  };

  const handleEliminar = async () => {
    try {
      await deleteUsuario(confirmarEliminar.id);
      setConfirmarEliminar({ visible: false, id: null, nombre: "" , apellido: ""});
      cargarUsuarios();
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    }
  };

  const handleCambiarRol = async () => {
    try {
      await changeUserRole(usuarioSeleccionado._id, nuevoRol);
      cerrarModales();
      cargarUsuarios();
    } catch (err) {
      console.error("Error cambiando rol:", err);
    }
  };

  const handleToggleActivo = async (id) => {
    await toggleUsuarioActivo(id);
    cargarUsuarios();
  };

  return (
    <div className="config-section">

      <div className="header-servicios">
        <h2>Gestión de Usuarios</h2>

        <button className="btn-agregar-top" onClick={abrirModalNuevo}>
          + Agregar Usuario
        </button>
      </div>

      <div className="tabla-servicios-container">
        <table className="tabla-servicios sticky-header">
          <thead>
            <tr>
              <th>Apellido</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style={{ width: "300px" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td>{u.apellido}</td>
                <td>{u.nombre}</td>
                <td>{u.usuario}</td>
                <td>{u.rol}</td>
                <td style={{ fontWeight: "bold", color: u.activo ? "green" : "red" }}>
                  {u.activo ? "Activo" : "Inactivo"}
                </td>

                <td>
                  <button className="btn-editar" onClick={() => abrirModalEditar(u)}>
                    Editar
                  </button>
                  
                  <button
                    className={u.activo ? "btn-eliminar" : "btn-guardar"}
                    onClick={() => handleToggleActivo(u._id)}
                  >
                    {u.activo ? "Desactivar" : "Activar"}
                  </button>

                  <button className="btn-eliminar" onClick={() => confirmarEliminarUsuario(u)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {usuarios.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                  No hay usuarios cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal agregar/editar */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-servicio">
            <h3>{editando ? "Editar Usuario" : "Agregar Usuario"}</h3>

            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formUsuario.apellido}
              onChange={handleChange}
            />

            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formUsuario.nombre}
              onChange={handleChange}
            />

            <input
              type="text"
              name="usuario"
              placeholder="Usuario"
              value={formUsuario.usuario}
              onChange={handleChange}
            />

            {!editando && (
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formUsuario.password}
                onChange={handleChange}
              />
            )}

            <select name="rol" value={formUsuario.rol} onChange={handleChange}>
              <option value="administrativo">Administrativo</option>
              <option value="mecanico">Mecánico</option>
            </select>

            <div className="modal-buttons">
              <button className="btn-guardar" onClick={handleGuardar}>
                Guardar
              </button>
              <button className="btn-cancelar" onClick={cerrarModales}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación eliminar */}
      {confirmarEliminar.visible && (
        <div className="modal-overlay">
          <div className="modal-confirmacion">
            <h3>Eliminar usuario</h3>
            <p>
              ¿Seguro que querés eliminar a <b>{confirmarEliminar.apellido}</b>?
            </p>

            <div className="modal-buttons">
              <button
                className="btn-cancelar"
                onClick={() =>
                  setConfirmarEliminar({
                    visible: false,
                    id: null,
                    apellido: "",
                  })
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
