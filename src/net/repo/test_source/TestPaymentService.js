import { axios } from "../../config";
import { handleResponse } from "../../handler/ResponseHandler";

function getChargeItemsByCode({medicalNumber}) {
    return axios.get(`/payment/patient?code=${medicalNumber}`).then(handleResponse)
}

function commitBill({paymentId, price}) {
    return axios.post('/payment/invoice', {
        payment: paymentId,
        price
    }).then(handleResponse)
}

function getPaymentMethods() {
    return axios.post('/payment/method').then(handleResponse)
}

export default {
    getChargeItemsByCode,
    getPaymentMethods,
    commitBill
}