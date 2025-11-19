// IntroScreen.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../assets/Logo.jpg"; 

const IntroScreen = () => {
  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <img src={logo} alt="Logo del proyecto" style={styles.logo} />
        <h1 style={styles.title}>Estado de Avance</h1>
        <p style={styles.subtitle}>Presentación del progreso del sistema</p>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    fontFamily: "Arial, sans-serif",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  logo: {
    width: "300px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "3rem",
    color: "#333",
    margin: 0,
  },
  subtitle: {
    fontSize: "1.5rem",
    color: "#666",
  },
};

export default IntroScreen;
