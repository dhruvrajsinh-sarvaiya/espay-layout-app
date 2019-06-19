// Actions For get Apip plan Data List By Tejas 26/2/2019

// import types
import {
    GET_API_PLAN_DATA,
    GET_API_PLAN_DATA_SUCCESS,
    GET_API_PLAN_DATA_FAILURE,
    GET_USER_ACTIVE_PLAN,
    GET_USER_ACTIVE_PLAN_SUCCESS,
    GET_USER_ACTIVE_PLAN_FAILURE,
    SET_AUTO_RENEWAL_PLAN,
    SET_AUTO_RENEWAL_PLAN_SUCCESS,
    SET_AUTO_RENEWAL_PLAN_FAILURE,
    STOP_AUTO_RENEWAL_PLAN,
    STOP_AUTO_RENEWAL_PLAN_SUCCESS,
    STOP_AUTO_RENEWAL_PLAN_FAILURE,
    GET_AUTO_RENEWAL_PLAN,
    GET_AUTO_RENEWAL_PLAN_SUCCESS,
    GET_AUTO_RENEWAL_PLAN_FAILURE,
    SET_MANUAL_RENEWAL_PLAN,
    SET_MANUAL_RENEWAL_PLAN_SUCCESS,
    SET_MANUAL_RENEWAL_PLAN_FAILURE,
} from "Actions/types";

//action for Get Api Plan List and set type for reducers
export const getApiPlanList = Data => ({
    type: GET_API_PLAN_DATA,
    payload: { Data }
});

//action for set Success and Get Api Plan List and set type for reducers
export const getApiPlanListSuccess = response => ({
    type: GET_API_PLAN_DATA_SUCCESS,
    payload: response
});

//action for set failure and error to Get Api Plan List and set type for reducers
export const getApiPlanListFailure = error => ({
    type: GET_API_PLAN_DATA_FAILURE,
    payload: error
});

//action for View User Active Plan and set type for reducers
export const getUserActivePlan = Data => ({
    type: GET_USER_ACTIVE_PLAN,
    payload: { Data }
});

//action for set Success and View User Active Plan and set type for reducers
export const getUserActivePlanSuccess = response => ({
    type: GET_USER_ACTIVE_PLAN_SUCCESS,
    payload: response
});

//action for set failure and error to View User Active Plan and set type for reducers
export const getUserActivePlanFailure = error => ({
    type: GET_USER_ACTIVE_PLAN_FAILURE,
    payload: error
});

//action for Set Auto Renewal and set type for reducers
export const setAutoRenewal = Data => ({
    type: SET_AUTO_RENEWAL_PLAN,
    payload: { Data }
});

//action for set Success and Set Auto Renewal and set type for reducers
export const setAutoRenewalSuccess = response => ({
    type: SET_AUTO_RENEWAL_PLAN_SUCCESS,
    payload: response
});

//action for set failure and error to Set Auto Renewal and set type for reducers
export const setAutoRenewalFailure = error => ({
    type: SET_AUTO_RENEWAL_PLAN_FAILURE,
    payload: error
});

//action for Stop Auto Renewal and set type for reducers
export const stopAutoRenewal = Data => ({
    type: STOP_AUTO_RENEWAL_PLAN,
    payload: { Data }
});

//action for set Success and Stop Auto Renewal and set type for reducers
export const stopAutoRenewalSuccess = response => ({
    type: STOP_AUTO_RENEWAL_PLAN_SUCCESS,
    payload: response
});

//action for set failure and error to Stop Auto Renewal and set type for reducers
export const stopAutoRenewalFailure = error => ({
    type: STOP_AUTO_RENEWAL_PLAN_FAILURE,
    payload: error
});

//action for GET Auto Renewal and set type for reducers
export const getAutoRenewalPlan = Data => ({
    type: GET_AUTO_RENEWAL_PLAN,
    payload: { Data }
});

//action for set Success and GET Auto Renewal and set type for reducers
export const getAutoRenewalPlanSuccess = response => ({
    type: GET_AUTO_RENEWAL_PLAN_SUCCESS,
    payload: response
});

//action for set failure and error to GET Auto Renewal and set type for reducers
export const getAutoRenewalPlanFailure = error => ({
    type: GET_AUTO_RENEWAL_PLAN_FAILURE,
    payload: error
});

//action for set Manual Renew and set type for reducers
export const manualRenewPlan = Data => ({
    type: SET_MANUAL_RENEWAL_PLAN,
    payload: { Data }
});

//action for set Success and set Manual Renew and set type for reducers
export const manualRenewPlanSuccess = response => ({
    type: SET_MANUAL_RENEWAL_PLAN_SUCCESS,
    payload: response
});

//action for set failure and error to set Manual Renew and set type for reducers
export const manualRenewPlanFailure = error => ({
    type: SET_MANUAL_RENEWAL_PLAN_FAILURE,
    payload: error
});