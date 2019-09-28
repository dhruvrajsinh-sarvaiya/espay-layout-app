import {
    // Get Provider Balance List
    GET_PROVIDER_BAL_LIST,
    GET_PROVIDER_BAL_LIST_SUCCESS,
    GET_PROVIDER_BAL_LIST_FAILURE,

    // Clear Provider Balance Data
    CLEAR_PROVIDER_BAL_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Provider Balance List
export function getProviderBalList(payload = {}) {
    return action(GET_PROVIDER_BAL_LIST, { payload })
}

// Redux action for Get Provider Balance List Success
export function getProviderBalListSuccess(data) {
    return action(GET_PROVIDER_BAL_LIST_SUCCESS, { data })
}

// Redux action for Get Provider Balance List Failure
export function getProviderBalListFailure() {
    return action(GET_PROVIDER_BAL_LIST_FAILURE)
}

// Redux action for Clear Provider Balance List
export function clearProviderBalData() {
    return action(CLEAR_PROVIDER_BAL_DATA)
}