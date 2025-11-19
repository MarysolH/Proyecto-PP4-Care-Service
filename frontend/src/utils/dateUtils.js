// Convierte Date o string a "YYYY-MM-DD" usando UTC
export function formatDateLocal(date) {
  if (!date) return "";
  let d;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "string") {
    const [y, m, day] = date.split("-");
    d = new Date(y, m - 1, day);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Convierte "YYYY-MM-DD" a "DD/MM/YY" para mostrar en resumen
export function formatDateForSummary(fechaStr) {
  if (!fechaStr) return "";
  const [y, m, d] = fechaStr.split("-");
  return `${d}/${m}/${y.slice(-2)}`;
}

// Devuelve color según estado
export function getColor(estado) {
  switch (estado) {
    case "Reservado":
      return "#d1d1d1";
    case "Disponible":
      return "#ffffff";
    case "Contingencia":
      return "#646464ff";
    default:
      return "#ffffff";
  }
}
