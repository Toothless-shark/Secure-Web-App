import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // L'URL de ton backend


// Helper function to set headers with the token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Auth-related API calls
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; // Returns the token if authentication suceeds
  } catch (error) {
    console.error("Erreur de connexion :", error);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, getAuthHeaders());
    return response.data; // Returns user info
  } catch (error) {
    console.error("Erreur lors du chargement des informations utilisateur :", error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return response.data; // Returns success message
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    throw error;
  }
};

export const protectedRoute = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/protected`, getAuthHeaders());
    return response.data; // Returns protected route message
  } catch (error) {
    console.error("Erreur lors de l'accès à la route protégée :", error);
    throw error;
  }
};

// User-related API calls
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data; // Returns list of users
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error;
  }
};

export const createUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users`, { username, email, password }, getAuthHeaders());
    return response.data; // Returns success message
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    throw error;
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, updatedData, getAuthHeaders());
    return response.data; // Returns updated user info
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
    return response.data; // Returns success message
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
};