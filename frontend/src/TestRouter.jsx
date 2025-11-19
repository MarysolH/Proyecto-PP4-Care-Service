import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Pantalla Home</h2>
      <Link to="/otra">Ir a otra</Link>
    </div>
  );
}

function Otra() {
  return (
    <div>
      <h2>Pantalla Otra</h2>
      <Link to="/">Volver a Home</Link>
    </div>
  );
}

export default function TestRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/otra" element={<Otra />} />
      </Routes>
    </BrowserRouter>
  );
}
