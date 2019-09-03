import {
    ADD_DIAGNOSIS,
    ADD_PRESCRIPTION,
    REMOVE_DIAGNOSIS,
    REMOVE_PRESCRIPTION,
    SET_LOADING,
    SET_MESSAGE
} from "./action";

export function addDiagnosis(ctx, diagnosis) {
    ctx.dispatch({
        type: ADD_DIAGNOSIS,
        diagnosis: diagnosis
    })
}

export function addPrescription(ctx, prescription) {
    ctx.dispatch({
        type: ADD_PRESCRIPTION,
        prescription: prescription
    })
}

export function removeDiagnosis(ctx, reservationId) {
    ctx.dispatch({
        type: REMOVE_DIAGNOSIS,
        reservationId: reservationId
    })
}

export function removePrescription(ctx, reservationId) {
    ctx.dispatch({
        type: REMOVE_PRESCRIPTION,
        reservationId: reservationId
    })
}

export function showLoading(ctx, message = '加载中') {
    ctx.dispatch({
        type: SET_LOADING,
        loadingMessage: {
            isLoading: true,
            message: message
        }
    })
}

export function hideLoading(ctx) {
    ctx.dispatch({
        type: SET_LOADING,
        loadingMessage: {
            isLoading: false,
            message: ''
        }
    })
}

export function showSuccessMessage(ctx, message, onClose) {
    ctx.dispatch({
        type: SET_MESSAGE,
        snackbarMessage: {
            open: true,
            type: 'success',
            message: message,
            onClose: () => {
                ctx.dispatch({
                    type: SET_MESSAGE,
                    snackbarMessage: {
                        ...ctx.state.snackbarMessage,
                        type: 'success',
                        message: message,
                        open: false
                    }
                });
                onClose && onClose();
            }
        }
    })
}

export function showErrorMessage(ctx, message, onClose) {
    ctx.dispatch({
        type: SET_MESSAGE,
        snackbarMessage: {
            open: true,
            type: 'error',
            message: message,
            onClose: () => {
                ctx.dispatch({
                    type: SET_MESSAGE,
                    snackbarMessage: {
                        ...ctx.state.snackbarMessage,
                        type: 'error',
                        message: message,
                        open: false
                    }
                });
                onClose && onClose();
            }
        }
    });
}
