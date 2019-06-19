// Actions For API Custom Limits By Tejas 14/3/2019

// import types
import {
    GET_CUSTOM_LIMITS,
    GET_CUSTOM_LIMITS_SUCCESS,
    GET_CUSTOM_LIMITS_FAILURE,
    SET_CUSTOM_LIMITS,
    SET_CUSTOM_LIMITS_SUCCESS,
    SET_CUSTOM_LIMITS_FAILURE,
    UPDATE_CUSTOM_LIMITS,
    UPDATE_CUSTOM_LIMITS_SUCCESS,
    UPDATE_CUSTOM_LIMITS_FAILURE,
    SET_DEFAULT_CUSTOM_LIMITS,
    SET_DEFAULT_CUSTOM_LIMITS_SUCCESS,
    SET_DEFAULT_CUSTOM_LIMITS_FAILURE,
} from "Actions/types";

//action for Get API Custom Limits  and set type for reducers
export const getCustomLimits = Data => ({
    type: GET_CUSTOM_LIMITS,
    payload: { Data }
});

//action for set Success and Get API Custom Limits  and set type for reducers
export const getCustomLimitsSuccess = response => ({
    type: GET_CUSTOM_LIMITS_SUCCESS,
    payload: response
});

//action for set failure and error to Get API Custom Limits  and set type for reducers
export const getCustomLimitsFailure = error => ({
    type: GET_CUSTOM_LIMITS_FAILURE,
    payload: error
});


//action for Set API Custom Limits  and set type for reducers
export const setCustomLimits = Data => ({
    type: SET_CUSTOM_LIMITS,
    payload: { Data }
});

//action for set Success and Set API Custom Limits  and set type for reducers
export const setCustomLimitsSuccess = response => ({
    type: SET_CUSTOM_LIMITS_SUCCESS,
    payload: response
});

//action for set failure and error to Set API Custom Limits  and set type for reducers
export const setCustomLimitsFailure = error => ({
    type: SET_CUSTOM_LIMITS_FAILURE,
    payload: error
});

//action for Update API Custom Limits  and set type for reducers
export const updateCustomLimits = Data => ({
    type: UPDATE_CUSTOM_LIMITS,
    payload: { Data }
});

//action for set Success and Update API Custom Limits  and set type for reducers
export const updateCustomLimitsSuccess = response => ({
    type: UPDATE_CUSTOM_LIMITS_SUCCESS,
    payload: response
});

//action for set failure and error to Update API Custom Limits  and set type for reducers
export const updateCustomLimitsFailure = error => ({
    type: UPDATE_CUSTOM_LIMITS_FAILURE,
    payload: error
});

//action for Set Default Limits  and set type for reducers
export const setDefaultCustomLimits = Data => ({
    type: SET_DEFAULT_CUSTOM_LIMITS,
    payload: { Data }
});

//action for set Success and Set Default Limits  and set type for reducers
export const setDefaultCustomLimitsSuccess = response => ({
    type: SET_DEFAULT_CUSTOM_LIMITS_SUCCESS,
    payload: response
});

//action for set failure and error to Set Default Limits  and set type for reducers
export const setDefaultCustomLimitsFailure = error => ({
    type: SET_DEFAULT_CUSTOM_LIMITS_FAILURE,
    payload: error
});