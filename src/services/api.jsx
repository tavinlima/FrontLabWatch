import axios from 'axios';

const api = axios.create({
    baseURL: 'http://labwatch-backend.azurewebsites.net/api',
});

export default api;