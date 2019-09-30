import {
    // Get Service Provider Balance List
    GET_SERVICE_PROVIDER_BAL_LIST,
    GET_SERVICE_PROVIDER_BAL_LIST_SUCCESS,
    GET_SERVICE_PROVIDER_BAL_LIST_FAILURE
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Charge Configuration List
export function getServiceProviderBalList(payload) {
    return action(GET_SERVICE_PROVIDER_BAL_LIST, { payload })
}

// Redux action for Get Charge Configuration List Success
export function getServiceProviderBalListSuccess(data) {
    return action(GET_SERVICE_PROVIDER_BAL_LIST_SUCCESS, { data })
}

// Redux action for Get Charge Configuration List Success
export function getServiceProviderBalListFailure() {
    return action(GET_SERVICE_PROVIDER_BAL_LIST_FAILURE)
}