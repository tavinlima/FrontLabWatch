import axios from 'axios';

const api = axios.create({
    baseURL: 'https://labwatch-backend.azurewebsites.net/api',
});

export default api;