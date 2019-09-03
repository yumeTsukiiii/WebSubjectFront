import { axios } from "../../config";
import { handleResponse } from "../../handler/ResponseHandler";

function getRegisteredCode() {
    return {
        code: '23940193'
    };
}

function gerRegisteredTypes() {
    return {
        type: [
            {
                id: 1,
                name: '番外号'
            },
            {
                id: 2,
                name: 'av号'
            }
        ]
    };
}

function getDepartments() {
    return {
        departments: [
            '🐂🍺科室',
            '尼🐎科室'
        ]
    };
}

function getDoctorsByDepartment({department}) {
    return {
        doctor: [
            "doctor_fuck", "doctor_shit"
        ]
    }
}

function getLimitationByDoctor({doctor}) {
    return {
        max: 20,
        used: 10
    }
}

function getPatientInfoByMedicalNumber({code}) {
    return {
        name: '菜虚鲲',
        sex: '人妖',
        birthday: '9021-13-13'
    }
}

function registered(
    { code, name, sex, birthday,
        payment, date, isMorning,
            type, doctor, price
}) {
    return axios.post('/reservation/new', {
        code, name, sex, birthday, payment, date, isMorning, type, doctor, price
    }).then(handleResponse);
}

function unregistered({medicalNumber}) {
    return axios.post('/reservation/cancel', {
        reservation_id: medicalNumber
    }).then(handleResponse)
}

function getRegisteredInfoByMedicalNumber({medicalNumber}) {
    return axios.post('/reservation/search', {
        code: medicalNumber
    }).then(handleResponse)
}

export default {
    getDepartments,
    getDoctorsByDepartment,
    getLimitationByDoctor,
    getPatientInfoByMedicalNumber,
    getRegisteredCode,
    getRegisteredInfoByMedicalNumber,
    getRegisteredTypes: gerRegisteredTypes,
    registered,
    unregistered
}