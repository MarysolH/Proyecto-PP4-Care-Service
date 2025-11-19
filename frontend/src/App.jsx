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
import ConfiguracionTaller from "./pages/ConfiguracionTaller/ConfiguracionTaller";
import OrdenesView from "./pages/OrdenesView";
import ListadoOrdenes from "./pages/ListadoOrdenes";

import DetalleOrden from "./pages/DetalleOrden";
import FacturacionView from "./pages/FacturacionView";
import ComprobanteView from "./pages/ComprobanteView";
import LoginMecanico from "./pages/LoginMecanico";
// import IntroScreen from "./pages/IntroScreen";
// import TestTurnos from "./pages/TestTurnos";
import { TurnosProvider } from "./context/TurnosContext";
import { UserProvider } from "./context/UserContext";
//import TestEstaciones from "./pages/ConfiguracionTaller/TestEstaciones";  // ajusta la ruta según donde esté
import { OrdenesProvider } from "./context/OrdenesContext";


function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/"; // oculta header/footer en login

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
      <UserProvider>
        <TurnosProvider>
          <OrdenesProvider>
         
            <Routes>
              <Route path="/" element={<Login />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/agendar-turno" element={<AgendarTurno />} />
              <Route path="/turnos-view" element={<TurnosView />} />
              <Route path="/orden-trabajo" element={<OrdenTrabajo />} />
              <Route path="/ordenes-view" element={<OrdenesView />} />
              <Route path="/taller" element={<Taller />} />
              <Route path="/orden-taller" element={<OrdenTaller />} />
              <Route path="/puntos-control-view" element={<PuntosControlView />} />
              <Route path="/login-mecanico" element={<LoginMecanico />} />
              <Route path="/configuracion-taller" element={<ConfiguracionTaller />}/>
              <Route path="/listado-ordenes" element={<ListadoOrdenes />} />
              <Route path="/detalle-orden" element={<DetalleOrden />} />
              <Route path="/facturacion-view" element={<FacturacionView />} />
              <Route path="/comprobante-view" element={<ComprobanteView />} />
              
              {/* 🔹 Rutas desactivadas para probar por partes */}
              {/*                                   
                                        
              <Route path="/intro-screen" element={<IntroScreen />} />
              <Route path="/test-turnos" element={<TestTurnos />} />
              <Route path="/test-estaciones" element={<TestEstaciones />} />
              */}
            </Routes>
          </OrdenesProvider> 
        </TurnosProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

