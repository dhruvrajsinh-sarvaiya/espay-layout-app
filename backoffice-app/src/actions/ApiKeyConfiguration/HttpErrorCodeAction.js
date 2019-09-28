// HttpErrorCodeAction.js
import {
    // for Http Error Code Data
    GET_HTTP_ERROR_CODE_LIST,
    GET_HTTP_ERROR_CODE_LIST_SUCCESS,
    GET_HTTP_ERROR_CODE_LIST_FAILURE,

    // for Clear Http Error Code Data
    CLEAR_HTTP_ERROR_CODE_LIST
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux Action For get Http Error Code
export function getHttpErrorCodeList(payload = {}) {
    return action(GET_HTTP_ERROR_CODE_LIST, { payload })
}

// Redux Action For get Http Error Code Success
export function getHttpErrorCodeListSuccess(data) {
    return action(GET_HTTP_ERROR_CODE_LIST_SUCCESS, { data })
}

// Redux Action For get Http Error Code Failure
export function getHttpErrorCodeListFailure() {
    return action(GET_HTTP_ERROR_CODE_LIST_FAILURE)
}

// Redux Action For Clear Http Error Code
export function clearHttpErrorCodeList() {
    return action(CLEAR_HTTP_ERROR_CODE_LIST)
}