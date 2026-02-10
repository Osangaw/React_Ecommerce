import axios from 'axios';

const BASE_URL = "https://e-commerce-backend-r8j1.onrender.com"
//"http://localhost:3031" ;
//"http://localhost:3030";

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;