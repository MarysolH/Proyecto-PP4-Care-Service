import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/FacturacionView.css";

function FacturacionView() {
  const location = useLocation();
  const navigate = useNavigate();

  const ordenRecibida = location.state?.orden;

  if (!ordenRecibida) {
    return <p>No hay datos de la orden para facturar.</p>;
  }

  // Normalizamos cliente y vehículo igual que en OrdenTaller
  const orden = {
    ...ordenRecibida,
    cliente: ordenRecibida.cliente || {
      nombre: ordenRecibida.cliente?.nombre || ordenRecibida.clienteNombre || "-",
      apellido: ordenRecibida.cliente?.apellido || ordenRecibida.clienteApellido || "",
      telefono: ordenRecibida.cliente?.telefono || ordenRecibida.telefono || "-",
    },
    vehiculo: ordenRecibida.vehiculo || {
      marca: ordenRecibida.vehiculo?.marca || ordenRecibida.vehiculoMarca || "-",
      modelo: ordenRecibida.vehiculo?.modelo || ordenRecibida.vehiculoModelo || "-",
      anio: ordenRecibida.vehiculo?.anio || ordenRecibida.vehiculoAnio || "-",
      patente: ordenRecibida.vehiculo?.patente || ordenRecibida.patente || "-",
    },
  };

  const [servicios, setServicios] = useState([
    {
      descripcion: orden.servicio,
      cantidad: 1,
      precioUnitario: 15000,
    },
    ...(orden.serviciosAdicionales?.filter(s => s.realizado).map(s => ({
      descripcion: s.nombre,
      cantidad: 1,
      precioUnitario: 5000,
    })) || []),
  ]);

  const [editable, setEditable] = useState(false);

  const handleEditServicio = (index, campo, valor) => {
    const nuevos = [...servicios];
    nuevos[index][campo] = campo === "descripcion" ? valor : Number(valor);
    setServicios(nuevos);
  };

  const handleEliminarServicio = (index) => {
    const nuevos = servicios.filter((_, i) => i !== index);
    setServicios(nuevos);
  };

  const subtotal = servicios.reduce((acc, s) => acc + s.cantidad * s.precioUnitario, 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const handleConfirmarFactura = () => {
    navigate("/comprobante-view", { state: { orden } });
  };

  return (
    <div className="facturacion-page">
      <Header username="Admin" />
      <div className="facturacion-content">
        <Sidebar />
        <main className="facturacion-main">
          <h1 className="facturacion-title">Facturación</h1>

          {/* Datos del cliente */}
          <div className="facturacion-card datos-cliente">
            <h3>Datos del Cliente</h3>
            <p><strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellido}</p>
            <p><strong>Teléfono:</strong> {orden.cliente.telefono}</p>
            <p><strong>Vehículo:</strong> {orden.vehiculo.marca} {orden.vehiculo.modelo} ({orden.vehiculo.patente})</p>
          </div>

          {/* Servicios */}
          <div className="facturacion-card servicios">
            <h3>Servicios Realizados</h3>
            <button
              className="facturacion-btn-editar"
              onClick={() => setEditable(!editable)}
            >
              {editable ? "Bloquear edición" : "Editar servicios"}
            </button>

            <table className="facturacion-tabla">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                  {editable && <th></th>}
                </tr>
              </thead>
              <tbody>
                {servicios.map((servicio, index) => (
                  <tr key={index}>
                    <td>
                      {editable ? (
                        <input
                          type="text"
                          value={servicio.descripcion}
                          onChange={(e) => handleEditServicio(index, "descripcion", e.target.value)}
                        />
                      ) : (
                        servicio.descripcion
                      )}
                    </td>
                    <td>
                      {editable ? (
                        <input
                          type="number"
                          min="1"
                          value={servicio.cantidad}
                          onChange={(e) => handleEditServicio(index, "cantidad", e.target.value)}
                        />
                      ) : (
                        servicio.cantidad
                      )}
                    </td>
                    <td>
                      {editable ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={servicio.precioUnitario}
                          onChange={(e) => handleEditServicio(index, "precioUnitario", e.target.value)}
                        />
                      ) : (
                        `$ ${servicio.precioUnitario}`
                      )}
                    </td>
                    <td>$ {servicio.cantidad * servicio.precioUnitario}</td>
                    {editable && (
                      <td>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleEliminarServicio(index)}
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="facturacion-card totales">
            <p><strong>Subtotal:</strong> ${subtotal.toLocaleString("es-AR")}</p>
            <p><strong>IVA (21%):</strong> ${iva.toLocaleString("es-AR")}</p>
            <p className="facturacion-total"><strong>Total:</strong> ${total.toLocaleString("es-AR")}</p>
          </div>

          {/* Botones */}
          <div className="facturacion-botones">
            <button
              className="facturacion-btn facturacion-btn-volver"
              onClick={() => navigate("/detalle-orden", { state: { orden } })}
            >
              Volver
            </button>
            <button
              className="facturacion-btn facturacion-btn-confirmar"
              onClick={handleConfirmarFactura}
            >
              Confirmar Factura
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default FacturacionView;
