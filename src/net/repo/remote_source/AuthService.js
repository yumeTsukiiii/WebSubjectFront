import { axios } from '../../config';
import { handleResponse } from '../../handler/ResponseHandler'

function login({ username, password }) {
    return axios.post('/auth/login',{
       username, password
    }).then(handleResponse)
}

function logout() {
    return axios.get('/auth/logout').then(handleResponse)
}

export default {
    login, logout
}