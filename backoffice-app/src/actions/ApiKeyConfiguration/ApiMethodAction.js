import {
    //API Method List
    LIST_API_METHOD,
    LIST_API_METHOD_SUCCESS,
    LIST_API_METHOD_FAILURE,

    //API Method add
    ADD_API_METHOD,
    ADD_API_METHOD_SUCCESS,
    ADD_API_METHOD_FAILURE,

    //API Method update
    UPDATE_API_METHOD,
    UPDATE_API_METHOD_SUCCESS,
    UPDATE_API_METHOD_FAILURE,

    //System rest method
    LIST_SYSTEM_REST_METHOD,
    LIST_SYSTEM_REST_METHOD_SUCCESS,
    LIST_SYSTEM_REST_METHOD_FAILURE,

    //Socket method
    LIST_SOCKET_METHOD,
    LIST_SOCKET_METHOD_SUCCESS,
    LIST_SOCKET_METHOD_FAILURE,

    //Clear data
    API_METHOD_CLEAR
} from '../ActionTypes'

import { action } from "../GlobalActions";

// Redux action for Display API Method List
export function getApiMethodData() {
    return action(LIST_API_METHOD)
}

// Redux action for Display API Method List Success
export function getApiMethodDataSuccess(response) {
    return action(LIST_API_METHOD_SUCCESS, { payload: response })
}

// Redux action for Display API Method List Failure
export function getApiMethodDataFailure(error) {
    return action(LIST_API_METHOD_FAILURE, { payload: error })
}

// Redux action for Add Api Method
export function addApiMethod(request) {
    return action(ADD_API_METHOD, { payload: request })
}

// Redux action for Add Api Method success
export function addApiMethodSuccess(response) {
    return action(ADD_API_METHOD_SUCCESS, { payload: response })
}

// Redux action for Add Api Method failure
export function addApiMethodFailure(error) {
    return action(ADD_API_METHOD_FAILURE, { payload: error })
}

// Redux action for Edit Api Method
export function updateApiMethod(request) {
    return action(UPDATE_API_METHOD, { payload: request })
}

// Redux action for Edit Api Method success
export function updateApiMethodSuccess(response) {
    return action(UPDATE_API_METHOD_SUCCESS, { payload: response })
}

// Redux action for Edit Api Method Failure
export function updateApiMethodFailure(error) {
    return action(UPDATE_API_METHOD_FAILURE, { payload: error })
}

// Redux action for Get SystemRest Method list
export function getSystemResetMethodData() {
    return action(LIST_SYSTEM_REST_METHOD)
}

// Redux action for Get SystemRest Method list Method success
export function getSystemResetMethodDataSuccess(response) {
    return action(LIST_SYSTEM_REST_METHOD_SUCCESS, { payload: response })
}

// Redux action for Get SystemRest Method list Method failure
export function getSystemResetMethodDataFailure(error) {
    return action(LIST_SYSTEM_REST_METHOD_FAILURE, { payload: error })
}

// Redux action for Get System socket Method list
export function getSocketMethodData() {
    return action(LIST_SOCKET_METHOD)
}

// Redux action for Get System socket Method list Method success
export function getSocketMethodDataSuccess(response) {
    return action(LIST_SOCKET_METHOD_SUCCESS, { payload: response })
}

// Redux action for Get System socket Method list Method failure
export function getSocketMethodDataFailure(error) {
    return action(LIST_SOCKET_METHOD_FAILURE, { payload: error })
}

// for clear reducer of Api method list
export function clearApiMethod() {
    return action(API_METHOD_CLEAR)
}
