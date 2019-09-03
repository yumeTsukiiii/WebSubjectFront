import { axios } from "../../config";
import { handleResponse } from "../../handler/ResponseHandler";

function getWaitingDrugsByCodeAndTime({code, time}) {
    return axios.post("/distribution/waiting", {
        code, time
    }).then(handleResponse)
}

function medicine({id}) {
    return axios.post("/distribution/", {
        id
    }).then(handleResponse)
}

export default {
    getWaitingDrugsByCodeAndTime,
    medicine
}