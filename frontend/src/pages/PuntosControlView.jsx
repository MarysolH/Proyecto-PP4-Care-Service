import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/PuntosControlView.css";
import auto from "../assets/auto.jpg"; // imagen única

function PuntosControlView({ onVolver }) {
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate("/orden-taller");
  };

  return (
    <div className="puntos-page">
      <Header username="Taller" />
      <main className="puntos-main">
         <h1 className="taller-title">Puntos de Control</h1>
        <button className="volver-btn" onClick={handleVolver}>
          ← Volver
        </button>
        <img src={auto} alt="Auto" className="auto-img" />
      </main>
      <Footer />
    </div>
  );
}

export default PuntosControlView;

