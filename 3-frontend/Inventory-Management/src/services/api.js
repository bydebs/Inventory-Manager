import axios from 'axios';

const api = axios.create({
  // Isso diz: "Use a URL da Vercel se existir, senão use o localhost"
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

export default api;