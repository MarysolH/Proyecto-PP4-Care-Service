import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { FaHome, FaCalendarAlt, FaClipboardList, FaList, FaTools, FaUsers, FaCar, FaFileInvoiceDollar, FaChartBar, FaCog, FaRegClock 
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Inicio", icon: <FaHome />, path: "/dashboard" },
    { name: "Agenda de turnos", icon: <FaCalendarAlt />, path: "/agenda" },
    { name: "Gestión de turnos y Recepción", icon: <FaList />, path: "/turnos-view" },
    { name: "Ingreso/Orden de trabajo", icon: <FaClipboardList />, path: "/orden-trabajo" },
    { name: "Estados ordenes taller", icon: <FaCar />, path: "/ordenes-view" },
    { name: "Facturación", icon: <FaFileInvoiceDollar />, path: "/facturacion-view" },
    { name: "Configuración de Taller", icon: <FaCog />, path: "/configuracion" },
    { name: "Vista Taller", icon: <FaTools />, path: "/taller" }, 
  ];

  return (
    <aside className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className={location.pathname === item.path ? "active" : ""}>
            <Link to={item.path}>
              {item.icon} {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
