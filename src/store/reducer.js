import {
    ADD_DIAGNOSIS, ADD_PRESCRIPTION, REMOVE_DIAGNOSIS, REMOVE_PRESCRIPTION,
    SET_LOADING,
    SET_MESSAGE,
} from "./action";


export const tipReducer = (state, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loadingMessage: action.loadingMessage
            };
        case SET_MESSAGE:
            return {
                ...state,
                snackbarMessage: action.snackbarMessage
            };
        case ADD_DIAGNOSIS:
            return {
                ...state,
                diagnosis: [
                    ...state.diagnosis,
                    action.diagnosis
                ]
            };
        case ADD_PRESCRIPTION:
            return {
                ...state,
                prescription: [
                    ...state.prescription,
                    action.prescription
                ]
            };
        case REMOVE_DIAGNOSIS:
            let newDiagnosis = [...state.diagnosis];
            let removedDiagnosisIndex = newDiagnosis.findIndex(item => item.reservationId === action.reservationId);
            return {
                ...state,
                diagnosis: newDiagnosis.slice(removedDiagnosisIndex, removedDiagnosisIndex + 1)
            };
        case REMOVE_PRESCRIPTION:
            let newPrescription = [...state.prescription];
            let removedIndex = newPrescription.findIndex(item => item.reservationId === action.reservationId);
            return {
                ...state,
                prescription: newPrescription.slice(removedIndex, removedIndex + 1)
            };
        default:
            return state;
    }
};