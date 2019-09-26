import { action } from "../GlobalActions";
import {
    //Total Complaint Count
    TOTAL_COMPLAIN_COUNT,
    TOTAL_COMPLAIN_COUNT_SUCCESS,
    TOTAL_COMPLAIN_COUNT_FAILURE,

    //Complain List
    GET_COMPLAIN_LIST,
    GET_COMPLAIN_LIST_SUCCESS,
    GET_COMPLAIN_LIST_FAILURE,

    //Raise Complain
    REPLY_COMPLAIN,
    REPLY_COMPLAIN_SUCCESS,
    REPLY_COMPLAIN_FAILURE,

    //complain List By Id
    GET_COMPLAIN_BY_ID,
    GET_COMPLAIN_BY_ID_SUCCESS,
    GET_COMPLAIN_BY_ID_FAILURE,

    //clear data
    REPLY_CLEAR_DATA,
    CLEAR_COMPLAIN_DATA
} from "../ActionTypes";

// Action for Total Complaint Count
export function getTotalComplainCount() {
    // for loading
    return action(TOTAL_COMPLAIN_COUNT)
}
export function getTotalComplainCountSuccess(data) {
    // for success call
    return action(TOTAL_COMPLAIN_COUNT_SUCCESS, { data })
}
export function getTotalComplainCountFailure() {
    // for failure call
    return action(TOTAL_COMPLAIN_COUNT_FAILURE)
}

// Action for Complain List
export function getComplainList(payload) {
    // for loading
    return action(GET_COMPLAIN_LIST, { payload })
}
export function getComplainListSuccess(data) {
    // for success call
    return action(GET_COMPLAIN_LIST_SUCCESS, { data })
}
export function getComplainListFailure() {
    // for failure call
    return action(GET_COMPLAIN_LIST_FAILURE)
}

// Action for Raise Complain
export function replyComplain(payload) {
    // for loading
    return action(REPLY_COMPLAIN, { payload })
}
export function replyComplainSuccess(data) {
    // for success call
    return action(REPLY_COMPLAIN_SUCCESS, { data })
}
export function replyComplainFailure() {
    // for failure call
    return action(REPLY_COMPLAIN_FAILURE)
}

// Clear Send Data
export function replyClearData() {
    return action(REPLY_CLEAR_DATA)
}

// Action for Complain List By Id
export function getComplainById(payload) {
    // for loading
    return action(GET_COMPLAIN_BY_ID, { payload })
}
export function getComplainByIdSuccess(data) {
    // for success call
    return action(GET_COMPLAIN_BY_ID_SUCCESS, { data })
}
export function getComplainByIdFailure() {
    // for failure call
    return action(GET_COMPLAIN_BY_ID_FAILURE)
}

export function clearComplainData() {
    // for failure call
    return action(CLEAR_COMPLAIN_DATA)
}