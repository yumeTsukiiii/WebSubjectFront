import { axios } from "../../config";
import { handleResponse } from "../../handler/ResponseHandler";

function getRegisteredItemsByNowaday() {
    return axios.post('/diagnosis/query').then(handleResponse);
}

function getPatientInfoByMedicalNumber({medicalNumber}) {
    return axios.post('/diagnosis/patient', {
        code: medicalNumber
    }).then(handleResponse);
}

function getDiseaseByName({diseaseName}) {
    return axios.post('/diagnosis/illness', {
        keyword: diseaseName
    }).then(handleResponse);
}

function getRecentMedicalRecordByCode({medicalNumber}) {
    return axios.post('/diagnosis/history', {
        code: medicalNumber
    }).then(handleResponse);
}

function commitDiagnose({
        reservation_id, description, current_history,
        treatment_situation, pass_history, allergy_history, check,
        diagnosis
}) {
    return axios.post('diagnosis/commit', {
        reservation_id,
        description,
        current_history,
        treatment_situation,
        pass_history,
        allergy_history,
        check,
        diagnosis
    }).then(handleResponse);
}

function getPrescriptionTemplateByName({diagnoseName}) {
    return axios.post('/diagnosis/template', {
        keyword: diagnoseName
    }).then(handleResponse);
}

function getPrescriptionTempDetailByName({name}) {
    return axios.post(`/diagnosis/detail`, {
        name
    }).then(handleResponse);
}

function commitPrescription({id, prescriptions}) {
    return axios.post('/diagnosis/prescription', {id, prescription: prescriptions}).then(handleResponse);
}

function getDrugsByName({drugName}) {
    return axios.post(`/diagnosis/medicine`, {
        keyword: drugName
    }).then(handleResponse);
}

export default {
    getPatientInfoByMedicalNumber,
    getPrescriptionTemplateByName,
    getPrescriptionTempDetailByName,
    getDiseaseByName,
    getDrugsByName,
    getRecentMedicalRecordByCode,
    getRegisteredItemsByNowaday,
    commitDiagnose,
    commitPrescription
}
