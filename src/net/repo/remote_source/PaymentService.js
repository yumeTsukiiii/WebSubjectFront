import { axios } from "../../config";
import { handleResponse } from "../../handler/ResponseHandler";

function getChargeItemsByCode({medicalNumber}) {
    return axios.post('/payment/patient', {
        code: medicalNumber
    }).then(handleResponse)
}

function commitBill({paymentId, price}) {
    return axios.post('/payment/invoice/commit', {
        code: paymentId,
        price
    }).then(handleResponse)
}

function getPaymentMethods() {
    return axios.post('/payment/method').then(handleResponse)
}

function changeDrugStatus({info}) {
    return axios.post("/payment/status", {
        info: info
    }).then(handleResponse)
}

export default {
    getChargeItemsByCode,
    getPaymentMethods,
    commitBill,
    changeDrugStatus
}