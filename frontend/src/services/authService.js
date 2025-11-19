import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data; // devuelve {id, nombre, email, rol, token}
};

export const registerUser = async (data) => {
  const res = await axios.post("http://localhost:5000/api/auth/register", data);
  return res.data;
};


export const changePassword = async (usuario, oldPassword, newPassword) => {
  const res = await axios.put(`${API_URL}/change-password`, {
    usuario,
    oldPassword,
    newPassword,
  });
  return res.data;
};

export const resetPassword = async (usuario) => {
  const res = await axios.post(`${API_URL}/reset-password`, { usuario });
  return res.data; 
};