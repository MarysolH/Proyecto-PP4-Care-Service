import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import Agenda from "./pages/Agenda";
import AgendarTurno from "./pages/AgendarTurno";
import OrdenTrabajo from "./pages/Ordentrabajo";
import Taller from "./pages/Taller";
import OrdenTaller from "./pages/OrdenTaller";
import TurnosView from "./pages/TurnosView";
import PuntosControlView from "./pages/PuntosControlView";
import { TurnosProvider } from "./context/TurnosContext";
import OrdenesView from "./pages/OrdenesView";
import DetalleOrden from "./pages/DetalleOrden";
import FacturacionView from "./pages/FacturacionView";
import ComprobanteView from "./pages/ComprobanteView";
import LoginMecanico from "./pages/LoginMecanico";

function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/"; // oculta en login

  return (
    <div className="app-layout">
      {!hideHeaderFooter && <Header user={{ name: "María" }} />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TurnosProvider>  
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda/>} />
          <Route path="/agendar-turno" element={<AgendarTurno />} />
          <Route path="/orden-trabajo" element={<OrdenTrabajo />} />
          <Route path="/taller" element= {<Taller />} />
          <Route path="/orden-taller" element= {<OrdenTaller/>} />
          <Route path="/turnos-view" element= {<TurnosView/>} />
          <Route path="/puntos-control-view" element= {<PuntosControlView/>} />
          <Route path="/ordenes-view" element= {<OrdenesView/>} />
          <Route path="/detalle-orden" element= {<DetalleOrden/>} />
          <Route path="/facturacion-view" element= {<FacturacionView/>} />
          <Route path="/comprobante-view" element= {<ComprobanteView/>} />
          <Route path="/login-mecanico" element= {<LoginMecanico/>} />

        </Routes>
      </TurnosProvider>        
    </BrowserRouter>
    
  );
}
