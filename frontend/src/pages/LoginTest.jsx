import React, { useState } from "react";

export default function LoginTest() {
  const [usuario, setUsuario] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Bienvenido ${usuario}`);
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Usuario"
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}
