import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.46:3333',
});

export { api };