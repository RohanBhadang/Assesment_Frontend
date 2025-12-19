import axios from 'axios';

const base = 'https://assesment-backend-1.onrender.com/api' || 'http://localhost:5000/api';
const API = axios.create({ baseURL: base });

export default API;
