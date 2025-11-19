import React, { useEffect, useState } from "react";
import "../../styles/ConfiguracionTaller.css";
import {
  getEstaciones,
  updateEstacion,
} from "../../services/estacionesService";
import { getUsuarios } from "../../services/usuariosService"; // para traer mecánicos

export default function ConfigEstaciones() {
  const [estaciones, setEstaciones] = useState([]);  
  const [mecanicos, setMecanicos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const est = await getEstaciones();
      setEstaciones(est);

      const mec = await getUsuarios(); 
      setMecanicos(mec.filter((u) => u.rol === "mecanico"));
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const asignarMecanico = async (idEstacion, idMecanico) => {
    try {
      await updateEstacion(idEstacion, { mecanico: idMecanico });

      setMensaje("Asignación guardada ✔");
      setTimeout(() => setMensaje(""), 2000);

      await cargarDatos();
    } catch (error) {
      console.error("Error al asignar mecánico:", error);
    }
  };

  return (
    <div className="config-section">
      <h2>Asignación de Mecánicos a Estaciones</h2>
      <p>Desde aquí podrás asignar qué mecánico trabaja en cada estación.</p>

      {mensaje && <div className="toast-mensaje">{mensaje}</div>}

      <div className="tabla-servicios-container">
        <table className="tabla-servicios sticky-header">
          <thead>
            <tr>
              <th>Estación</th>
              <th>Mecánico asignado</th>
            </tr>
          </thead>
          <tbody>
            {estaciones.map((e) => (
              <tr key={e._id}>
                <td>Estación {e.numero}</td>
                <td>
                  <select
                    className="select-mecanico"
                    value={e.mecanico?._id || ""}
                    onChange={(ev) => asignarMecanico(e._id, ev.target.value)}
                  >
                    <option value="">Sin asignar</option>

                    {mecanicos.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.apellido}, {m.nombre}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}

            {estaciones.length === 0 && (
              <tr>
                <td colSpan="2" style={{ textAlign: "center", color: "#777" }}>
                  Cargando estaciones...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
