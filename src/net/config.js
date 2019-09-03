import originAxios from 'axios';

export const axios = originAxios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
        'Content-type': 'application/json'
    }
});