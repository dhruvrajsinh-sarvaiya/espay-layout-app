import {
    // Get Deposition Interval List 
    GET_DEPOSITION_INTERVAL_LIST,
    GET_DEPOSITION_INTERVAL_LIST_SUCCESS,
    GET_DEPOSITION_INTERVAL_LIST_FAILURE,

    // Add Deposition Interval Data
    ADD_DEPOSITION_INTERVAL,
    ADD_DEPOSITION_INTERVAL_SUCCESS,
    ADD_DEPOSITION_INTERVAL_FAILURE,
    CLEAR_DEPOSITION_INTERVAL,
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Deposition Interval List
export function getDepositionIntervalList() {
    return action(GET_DEPOSITION_INTERVAL_LIST)
}

// Redux action for Get Deposition Interval List Success
export function getDepositionIntervalListSuccess(data) {
    return action(GET_DEPOSITION_INTERVAL_LIST_SUCCESS, { data })
}

// Redux action for Get Deposition Interval List Failure
export function getDepositionIntervalListFailure() {
    return action(GET_DEPOSITION_INTERVAL_LIST_FAILURE)
}

// Redux action for Add Deposition Interval List
export function addDepositionInterval(payload) {
    return action(ADD_DEPOSITION_INTERVAL, { payload })
}

// Redux action for Add Deposition Interval List Success
export function addDepositionIntervalSuccess(data) {
    return action(ADD_DEPOSITION_INTERVAL_SUCCESS, { data })
}

// Redux action for Add Deposition Interval List Success
export function addDepositionIntervalFailure() {
    return action(ADD_DEPOSITION_INTERVAL_FAILURE)
}

// Redux action for Clear Deposition Interval
export function clearDepositionInterval() {
    return action(CLEAR_DEPOSITION_INTERVAL)
}