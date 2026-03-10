import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  // L'option timeout évite que l'application ne bloque indéfiniment si le serveur ne répond pas
  timeout: 5000,
});
