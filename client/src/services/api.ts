import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5042/api/',
    headers: {
        post: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=utf-8',
        },
    },
    // withCredentials: true,
});

export default api;
