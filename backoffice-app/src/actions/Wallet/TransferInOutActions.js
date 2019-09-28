import {
    // Get Transfer In List
    GET_TRANSFER_IN_LIST,
    GET_TRANSFER_IN_LIST_SUCCESS,
    GET_TRANSFER_IN_LIST_FAILURE,

    // Get Transfer Out List
    GET_TRANSFER_OUT_LIST,
    GET_TRANSFER_OUT_LIST_SUCCESS,
    GET_TRANSFER_OUT_LIST_FAILURE,

    // Clear Transfer In/Out Data
    CLEAR_TRANSFER_IN_OUT_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Transfer In List
export function getTransferInList(payload) {
    return action(GET_TRANSFER_IN_LIST, { payload })
}

// Redux action for Get Transfer In List Success
export function getTransferInListSuccess(data) {
    return action(GET_TRANSFER_IN_LIST_SUCCESS, { data })
}

// Redux action for Get Transfer In List Success
export function getTransferInListFailure() {
    return action(GET_TRANSFER_IN_LIST_FAILURE)
}

// Redux action for Get Transfer Out List
export function getTransferOutList(payload) {
    return action(GET_TRANSFER_OUT_LIST, { payload })
}

// Redux action for Get Transfer Out List Success
export function getTransferOutListSuccess(data) {
    return action(GET_TRANSFER_OUT_LIST_SUCCESS, { data })
}

// Redux action for Get Transfer Out List Success
export function getTransferOutListFailure() {
    return action(GET_TRANSFER_OUT_LIST_FAILURE)
}

// Redux action for Clear Transfer In/Out List
export function clearTransferInOutData() {
    return action(CLEAR_TRANSFER_IN_OUT_DATA)
}