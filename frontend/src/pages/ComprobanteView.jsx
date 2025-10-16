import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import "./ComprobanteView.css";

function ComprobanteView() {
  const location = useLocation();
  const navigate = useNavigate();
  const orden = location.state?.orden;
  const printRef = useRef();

  if (!orden) {
    return <p>No se encontró la información del comprobante.</p>;
  }

  // Datos simulados del ejemplo de facturación
  const servicios = [
    { descripcion: orden.servicio, cantidad: 1, precioUnitario: 15000 },
    ...(orden.serviciosAdicionales?.map((s) => ({
      descripcion: s,
      cantidad: 1,
      precioUnitario: 5000,
    })) || []),
  ];

  const subtotal = servicios.reduce(
    (acc, s) => acc + s.cantidad * s.precioUnitario,
    0
  );
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="comprobante-page">
      <Header username="Admin" />
      <div className="comprobante-content">
        <Sidebar />

        <main className="comprobante-main">
          <div className="comprobante-container">
            {/* Encabezado de factura */}
            <div className="comprobante-header">
              <div className="comprobante-header-left">
                <p>
                  <strong>CARe SERVICE</strong>
                </p>
                <p>C.U.I.T: 30-01010101-3 - IIBB - CM: 902010101013</p>
                <p>DOM.COM: Cualquier Calle 123 - C.A.B.A.</p>
                <p>Tel: 11-9844-4444</p>
                <p>INICIO DE ACTIVIDAD: 01/10/2025</p>
                <p>IVA RESPONSABLE INSCRIPTO</p>
              </div>

              <div className="comprobante-header-center">
                <h1>FACTURA “B”</h1>
                <p className="comprobante-subtitulo">ORIGINAL (Cod. 006)</p>
              </div>
            </div>

            <hr className="comprobante-separador" />

            {/* Datos del comprador */}
            <div className="comprobante-datos-cliente">
              <p>
                <strong>Consumidor Final</strong>
              </p>
            </div>

            <hr className="comprobante-separador" />

            {/* Datos de factura */}
            <div className="comprobante-datos">
              <p>
                <strong>Fecha:</strong> {new Date().toLocaleDateString("es-AR")}
              </p>
              <p>
                <strong>NRO. COMP:</strong> 11111-0000001
              </p>
              <p>
                <strong>COND. VENTA:</strong> CONTADO
              </p>
            </div>

            <hr className="comprobante-separador" />

            <div className="comprobante-tabla-placeholder">
              <table className="comprobante-tabla">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((s, i) => (
                    <tr key={i}>
                      <td>{s.descripcion}</td>
                      <td>{s.cantidad}</td>
                      <td>${s.precioUnitario.toLocaleString("es-AR")}</td>
                      <td>
                        $
                        {(s.cantidad * s.precioUnitario).toLocaleString(
                          "es-AR"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Totales */}
              <div className="comprobante-totales">
                <p>
                  <strong>Total:</strong> ${total.toLocaleString("es-AR")}
                </p>
              </div>

              {/* Información fiscal */}
              <div className="comprobante-info-fiscal">
                <p>                  
                    RÉGIMEN DE TRANSPARENCIA FISCAL AL CONSUMIDOR (LEY 27.743)                  
                </p>
                <p><strong>IVA Contenido: ${iva.toLocaleString("es-AR")} </strong></p>
                <p>
                  LOS IMPUESTOS INFORMADOS SON LOS QUE CORRESPONDEN A NIVEL
                  NACIONAL
                </p>
              </div>

              {/* Pie del comprobante */}
              <div className="comprobante-pie">
                <div className="comprobante-pie-izq">
                  <p>
                    <strong>
                      *** REFERENCIA ELECTRÓNICA DEL COMPROBANTE ***
                    </strong>
                  </p>
                  <p>C.A.E. N°: 75475475475475 -
                  Vencimiento: 05/11/2025</p>
                </div>
                <div className="comprobante-pie-der">
                  <p>Orientación Cons. B.A. 0-800-222-9042</p>
                </div>
              </div>
            </div>
          </div>
          <div className="comprobante-botones">
            <button
              className="comprobante-btn volver"
              onClick={() =>
                navigate("/facturacion-view", { state: { orden } })
              }
            >
              Volver
            </button>
            <button
              className="comprobante-btn imprimir"
              onClick={handleImprimir}
            >
              Imprimir / Descargar PDF
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ComprobanteView;
