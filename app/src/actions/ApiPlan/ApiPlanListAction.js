import {
    // Get Api Plan List Data
    GET_API_PLAN_LIST_DATA,
    GET_API_PLAN_LIST_DATA_SUCCESS,
    GET_API_PLAN_LIST_DATA_FAILURE,

    // Subscribe Api Plan
    SUBSCRIBE_API_PLAN,
    SUBSCRIBE_API_PLAN_SUCCESS,
    SUBSCRIBE_API_PLAN_FAILURE,

    // Get User Active Plan
    GET_USER_ACTIVE_PLAN,
    GET_USER_ACTIVE_PLAN_SUCCESS,
    GET_USER_ACTIVE_PLAN_FAILURE,

    // Manual Renew Api Plan
    MANUAL_RENEW_API_PLAN,
    MANUAL_RENEW_API_PLAN_SUCCESS,
    MANUAL_RENEW_API_PLAN_FAILURE,

    // Claer Api Plan Data
    CLEAR_API_PLAN_DATA,

    // Set Auto Renew Api Plan
    SET_AUTO_RENEW_API_PLAN,
    SET_AUTO_RENEW_API_PLAN_SUCCESS,
    SET_AUTO_RENEW_API_PLAN_FAILURE,

    // Get Auto Renew Api Plan
    GET_AUTO_RENEW_API_PLAN,
    GET_AUTO_RENEW_API_PLAN_SUCCESS,
    GET_AUTO_RENEW_API_PLAN_FAILURE,

    // Stop Auto Renew Api Plan
    STOP_AUTO_RENEW_API_PLAN,
    STOP_AUTO_RENEW_API_PLAN_SUCCESS,
    STOP_AUTO_RENEW_API_PLAN_FAILURE,

    // Get Custom Limits
    GET_CUSTOM_LIMITS,
    GET_CUSTOM_LIMITS_SUCCESS,
    GET_CUSTOM_LIMITS_FAILURE,

    // Set Custom limits
    SET_CUSTOM_LIMITS,
    SET_CUSTOM_LIMITS_SUCCESS,
    SET_CUSTOM_LIMITS_FAILURE,

    // Edit Custom Limits
    EDIT_CUSTOM_LIMITS,
    EDIT_CUSTOM_LIMITS_SUCCESS,
    EDIT_CUSTOM_LIMITS_FAILURE,

    // Set Default Custom Limits
    SET_DEFAULT_CUSTOM_LIMITS,
    SET_DEFAULT_CUSTOM_LIMITS_SUCCESS,
    SET_DEFAULT_CUSTOM_LIMITS_FAILURE,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Get Api Plan List
export function getApiPlanListData() {
    return action(GET_API_PLAN_LIST_DATA)
}
// Redux action to Get Api Plan List Success
export function getApiPlanListDataSuccess(data) {
    return action(GET_API_PLAN_LIST_DATA_SUCCESS, { data })
}
// Redux action to Get Api Plan List Failure
export function getApiPlanListDataFailure() {
    return action(GET_API_PLAN_LIST_DATA_FAILURE)
}

// Redux action to Get Subscribe Plan Details
export function getSubscribePlanDetails(data) {
    return action(SUBSCRIBE_API_PLAN, { data })
}
// Redux action to Get Subscribe Plan Details Success
export function getSubscribePlanDetailsSuccess(data) {
    return action(SUBSCRIBE_API_PLAN_SUCCESS, { data })
}
// Redux action to Get Subscribe Plan Details Failure
export function getSubscribePlanDetailsFailure() {
    return action(SUBSCRIBE_API_PLAN_FAILURE)
}

// Redux action to Get User Active Plan
export function getUserActivePlan() {
    return action(GET_USER_ACTIVE_PLAN)
}
// Redux action to Get User Active Plan Success
export function getUserActivePlanSuccess(data) {
    return action(GET_USER_ACTIVE_PLAN_SUCCESS, { data })
}
// Redux action to Get User Active Plan Failure
export function getUserActivePlanFailure() {
    return action(GET_USER_ACTIVE_PLAN_FAILURE)
}

// Redux action to Manual Renew Api Plan
export function manualRenewApiPlan(data) {
    return action(MANUAL_RENEW_API_PLAN, { data })
}
// Redux action to Manual Renew Api Plan Success
export function manualRenewApiPlanSuccess(data) {
    return action(MANUAL_RENEW_API_PLAN_SUCCESS, { data })
}
// Redux action to Manual Renew Api Plan Failure
export function manualRenewApiPlanFailure() {
    return action(MANUAL_RENEW_API_PLAN_FAILURE)
}

// Redux action to Set Auto Renew Api Plan
export function setAutoRenewApiPlan(data) {
    return action(SET_AUTO_RENEW_API_PLAN, { data })
}
// Redux action to Set Auto Renew Api Plan Success
export function setAutoRenewApiPlanSuccess(data) {
    return action(SET_AUTO_RENEW_API_PLAN_SUCCESS, { data })
}
// Redux action to Set Auto Renew Api Plan Failure
export function setAutoRenewApiPlanFailure() {
    return action(SET_AUTO_RENEW_API_PLAN_FAILURE)
}

// Redux action to Get Auto Renew Api Plan
export function getAutoRenewApiPlan() {
    return action(GET_AUTO_RENEW_API_PLAN)
}
// Redux action to Get Auto Renew Api Plan Success
export function getAutoRenewApiPlanSuccess(data) {
    return action(GET_AUTO_RENEW_API_PLAN_SUCCESS, { data })
}
// Redux action to Get Auto Renew Api Plan Failure
export function getAutoRenewApiPlanFailure() {
    return action(GET_AUTO_RENEW_API_PLAN_FAILURE)
}

// Redux action to Stop Auto Renew Api Plan
export function stopAutoRenewApiPlan(data) {
    return action(STOP_AUTO_RENEW_API_PLAN, { data })
}
// Redux action to Stop Auto Renew Api Plan Success
export function stopAutoRenewApiPlanSuccess(data) {
    return action(STOP_AUTO_RENEW_API_PLAN_SUCCESS, { data })
}
// Redux action to Stop Auto Renew Api Plan Failure
export function stopAutoRenewApiPlanFailure() {
    return action(STOP_AUTO_RENEW_API_PLAN_FAILURE)
}

// Redux action to Get Custom Limits
export function getCustomLimits(data) {
    return action(GET_CUSTOM_LIMITS, { data })
}
// Redux action to Get Custom Limits Success
export function getCustomLimitsSuccess(data) {
    return action(GET_CUSTOM_LIMITS_SUCCESS, { data })
}
// Redux action to Get Custom Limits Failure
export function getCustomLimitsFailure() {
    return action(GET_CUSTOM_LIMITS_FAILURE)
}

// Redux action to Set Custom Limits
export function setCustomLimits(data) {
    return action(SET_CUSTOM_LIMITS, { data })
}
// Redux action to Set Custom Limits Success
export function setCustomLimitsSuccess(data) {
    return action(SET_CUSTOM_LIMITS_SUCCESS, { data })
}
// Redux action to Set Custom Limits Failure
export function setCustomLimitsFailure() {
    return action(SET_CUSTOM_LIMITS_FAILURE)
}

// Redux action to Edit Custom Limits
export function editCustomLimits(data) {
    return action(EDIT_CUSTOM_LIMITS, { data })
}
// Redux action to Edit Custom Limits Success
export function editCustomLimitsSuccess(data) {
    return action(EDIT_CUSTOM_LIMITS_SUCCESS, { data })
}
// Redux action to Edit Custom Limits Failure
export function editCustomLimitsFailure() {
    return action(EDIT_CUSTOM_LIMITS_FAILURE)
}

// Redux action to Set Default Custom Limits
export function setDefaultCustomLimits(data) {
    return action(SET_DEFAULT_CUSTOM_LIMITS, { data })
}
// Redux action to Set Default Custom Limits Success
export function setDefaultCustomLimitsSuccess(data) {
    return action(SET_DEFAULT_CUSTOM_LIMITS_SUCCESS, { data })
}
// Redux action to Set Default Custom Limits Failure
export function setDefaultCustomLimitsFailure() {
    return action(SET_DEFAULT_CUSTOM_LIMITS_FAILURE)
}

//To fetch data
export function clearApiPlanData() {
    return action(CLEAR_API_PLAN_DATA)
}