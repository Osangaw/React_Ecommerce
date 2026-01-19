import axios from 'axios';

const BASE_URL = "https://e-commerce-backend-r8j1.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;