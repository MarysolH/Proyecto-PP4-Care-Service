import axios from "axios";

const API_URL = "http://localhost:5000/api/usuarios";

export const createUsuario = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const getUsuarios = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getUsuarioById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const updateUsuario = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteUsuario = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const changeUserRole = async (id, rol) => {
  const res = await axios.put(`${API_URL}/${id}/rol`, { rol });
  return res.data;
};

// Activar / desactivar usuario (soft delete)
export const toggleUsuarioActivo = async (id) => {
  const res = await axios.put(`${API_URL}/${id}/toggle`);
  return res.data;
};

