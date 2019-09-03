import { axios } from "../../config";
import { handleResponse } from "../../handler/ResponseHandler";

function getRegisteredItemsByNowaday() {
    return axios.get('/diagnose/query').then(handleResponse);
}

function getPatientInfoByMedicalNumber({medicalNumber}) {
    return axios.get(`/diagnose/patient?code=${medicalNumber}`).then(handleResponse);
}

function getDiseaseByName({diseaseName}) {
    return axios.get(`/diagnose/illness?keyword=${diseaseName}`).then(handleResponse);
}

function getRecentMedicalRecordByCode({medicalNumber}) {
    return axios.get(`/diagnose/history?code=${medicalNumber}`).then(handleResponse);
}

function commitDiagnose({
        reservationId, description, currentHistory,
        treatmentSituation, passHistory, allergyHistory, check,
        diagnosis
}) {
    return axios.post('/diagnose/commit', {
        reservation_id: reservationId,
        description,
        current_history: currentHistory,
        treatment_situation: treatmentSituation,
        pass_history: passHistory,
        allergy_history: allergyHistory,
        check,
        diagnosis
    }).then(handleResponse);
}

function getDiagnosisTemplateByName({diagnoseName}) {
    return axios.get(`/diagnose/template?keyword=${diagnoseName}`).then(handleResponse);
}

function getDiagnoseDetailById({id}) {
    return axios.get(`/diagnose/template/detail?id=${id}`).then(handleResponse);
}

function commitPrescription({id, prescription}) {
    return axios.post('/diagnose/prescription', {
        id, prescription
    }).then(handleResponse);
}

function getDrugsByName({drugName}) {
    return axios.get(`/diagnose/prescription?keyword=${drugName}`).then(handleResponse);
}

export default {
    getPatientInfoByMedicalNumber,
    getDiagnosisTemplateByName,
    getDiagnoseDetailById,
    getDiseaseByName,
    getDrugsByName,
    getRecentMedicalRecordByCode,
    getRegisteredItemsByNowaday,
    commitDiagnose,
    commitPrescription
}
