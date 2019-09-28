import {
    // Add Provider Address
    ADD_PROVIDER_ADDRESS_LIST,
    ADD_PROVIDER_ADDRESS_LIST_SUCCESS,
    ADD_PROVIDER_ADDRESS_LIST_FAILURE,

    // Update Provider Address
    UPDATE_PROVIDER_ADDRESS_LIST,
    UPDATE_PROVIDER_ADDRESS_LIST_SUCCESS,
    UPDATE_PROVIDER_ADDRESS_LIST_FAILURE,

    // Clear Provider Address Data
    CLEAR_PROVIDER_ADDRESS_DATA
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Action for Add Provider Address
export function addProviderAddress(payload = {}) {
    return action(ADD_PROVIDER_ADDRESS_LIST, { payload })
}
// Action for Add Provider Address Success
export function addProviderAddressSuccess(data) {
    return action(ADD_PROVIDER_ADDRESS_LIST_SUCCESS, { data })
}
// Action for Add Provider Address Failure
export function addProviderAddressFailure() {
    return action(ADD_PROVIDER_ADDRESS_LIST_FAILURE)
}

// Action for Update Provider Address
export function updateProviderAddress(payload = {}) {
    return action(UPDATE_PROVIDER_ADDRESS_LIST, { payload })
}
// Action for Update Provider Address Success
export function updateProviderAddressSuccess(data) {
    return action(UPDATE_PROVIDER_ADDRESS_LIST_SUCCESS, { data })
}
// Action for Update Provider Address Failure
export function updateProviderAddressFailure() {
    return action(UPDATE_PROVIDER_ADDRESS_LIST_FAILURE)
}

// Redux action for Clear Provider Address Data
export function clearProviderAddressData() {
    return action(CLEAR_PROVIDER_ADDRESS_DATA)
}