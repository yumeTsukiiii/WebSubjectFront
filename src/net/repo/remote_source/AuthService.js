import { axios } from '../../config';
import { handleResponse } from '../../handler/ResponseHandler'

function login({ username, password, captcha }) {
    return axios.post('/auth/login',{
       username, password, captcha
    }).then(handleResponse)
}

function logout() {
    return axios.post('/auth/logout').then(handleResponse)
}

function getCaptcha() {
    return axios.get('/auth/captcha', {
        responseType: 'blob'
    })
}

function getUserName() {
    return axios.post('/auth/profile').then(handleResponse)
}

export default {
    login, logout, getCaptcha, getUserName
}