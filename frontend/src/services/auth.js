import API from "./api";
import { jwtDecode } from "jwt-decode";

// API calls
export const loginUser = (data) => API.post("/auth/login", data);

export const registerUser = (data) => API.post("/auth/register", data);

// Token helpers
export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return jwtDecode(token);
};

export const logout = () => {
  localStorage.removeItem("token");
};