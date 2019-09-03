import { axios } from "../../config";
import { handleResponse } from "../../handler/ResponseHandler";

function getRegisteredCode() {
    return axios.post('/reservation/code').then(handleResponse);
}

function getRegisteredTypes() {
    return axios.post('/reservation/type').then(handleResponse);
}

function getDepartments() {
    return axios.post('/reservation/department').then(handleResponse);
}

function getDoctorsByDepartment({department}) {
    return axios.post('/reservation/doctor?department', {department}).then(handleResponse);
}

function getLimitationByDoctor({doctor}) {
    return axios.post('/reservation/doctor/limitation', {doctor}).then(handleResponse)
}

function getPatientInfoByMedicalNumber({code}) {
    return axios.post('/reservation/patient', {code}).then(handleResponse)
}

function registered(
    { code, name, sex, birthday,
        payment, date, isMorning,
            doctor, home, identity_number, record_book, invoice_code
}) {
    return axios.post('/reservation/new', {
        code, name, sex, birthday, payment, date, isMorning, doctor, home, identity_number,
            record_book, invoice_code
    }).then(handleResponse);
}

function unregistered({medicalNumber}) {
    return axios.post('/reservation/cancel', {
        reservation_id: medicalNumber
    }).then(handleResponse)
}

function getRegisteredInfoByMedicalNumber({medicalNumber}) {
    return axios.post('/reservation/search', {code: medicalNumber}).then(handleResponse)
}

export default {
    getDepartments,
    getDoctorsByDepartment,
    getLimitationByDoctor,
    getPatientInfoByMedicalNumber,
    getRegisteredCode,
    getRegisteredInfoByMedicalNumber,
    getRegisteredTypes,
    registered,
    unregistered
}