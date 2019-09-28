import {
    // Clear Api Plan Config Data
    CLEAR_API_PLAN_CONFIG_DATA,

    // Get Rest Method Read Only
    GET_REST_METHOD_READ_ONLY,
    GET_REST_METHOD_READ_ONLY_SUCCESS,
    GET_REST_METHOD_READ_ONLY_FAILURE,

    // Get Rest Method Full Access
    GET_REST_METHOD_FULL_ACCESS,
    GET_REST_METHOD_FULL_ACCESS_SUCCESS,
    GET_REST_METHOD_FULL_ACCESS_FAILURE,

    // Add Api Plan Configuration 
    ADD_API_PLAN_CONFIG,
    ADD_API_PLAN_CONFIG_SUCCESS,
    ADD_API_PLAN_CONFIG_FAILURE,

    // Update Api Plan Configuration
    UPDATE_API_PLAN_CONFIG,
    UPDATE_API_PLAN_CONFIG_SUCCESS,
    UPDATE_API_PLAN_CONFIG_FAILURE,

} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Rest Method Read Only
export function getRestMethodReadOnly() {
    return action(GET_REST_METHOD_READ_ONLY)
}

// Redux action for Get Rest Method Read Only Success
export function getRestMethodReadOnlySuccess(data) {
    return action(GET_REST_METHOD_READ_ONLY_SUCCESS, { data })
}

// Redux action for Get Rest Method Read Only Failure
export function getRestMethodReadOnlyFailure() {
    return action(GET_REST_METHOD_READ_ONLY_FAILURE)
}

// Redux action for Rest Method Full Access
export function getRestMethodFullAccess() {
    return action(GET_REST_METHOD_FULL_ACCESS)
}

// Redux action for Rest Method Full Access Success
export function getRestMethodFullAccessSuccess(data) {
    return action(GET_REST_METHOD_FULL_ACCESS_SUCCESS, { data })
}

// Redux action for Rest Method Full Access Failure
export function getRestMethodFullAccessFailure() {
    return action(GET_REST_METHOD_FULL_ACCESS_FAILURE)
}

// Redux action for Add Api Plan Configuration Data
export function addApiPlanConfig(payload) {
    return action(ADD_API_PLAN_CONFIG, { payload })
}

// Redux action for Add Api Plan Configuration Data Success
export function addApiPlanConfigSuccess(data) {
    return action(ADD_API_PLAN_CONFIG_SUCCESS, { data })
}

// Redux action for Add Api Plan Configuration Data Failure
export function addApiPlanConfigFailure() {
    return action(ADD_API_PLAN_CONFIG_FAILURE)
}

// Redux action for update Api Plan Configuration Data
export function updateApiPlanConfig(payload) {
    return action(UPDATE_API_PLAN_CONFIG, { payload })
}

// Redux action for update Api Plan Configuration Data Success
export function updateApiPlanConfigSuccess(data) {
    return action(UPDATE_API_PLAN_CONFIG_SUCCESS, { data })
}

// Redux action for update Api Plan Configuration Data Failure
export function updateApiPlanConfigFailure() {
    return action(UPDATE_API_PLAN_CONFIG_FAILURE)
}

// Redux action for Clear Api Plan Configuration
export function clearApiPlanConfigData() {
    return action(CLEAR_API_PLAN_CONFIG_DATA)
}