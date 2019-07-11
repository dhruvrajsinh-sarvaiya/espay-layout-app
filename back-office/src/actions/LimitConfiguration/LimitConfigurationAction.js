

/**
 *   Developer : Parth Andhariya
 *   Date : 25-03-2019
 *   Component: Limit Configuration Action
 */
import {
    GET_LIMIT_CONFIGURATION,
    GET_LIMIT_CONFIGURATION_SUCCESS,
    GET_LIMIT_CONFIGURATION_FAILURE,
    ADD_LIMIT_CONFIGURATION,
    ADD_LIMIT_CONFIGURATION_SUCCESS,
    ADD_LIMIT_CONFIGURATION_FAILURE,
    UPDATE_LIMIT_CONFIGURATION,
    UPDATE_LIMIT_CONFIGURATION_SUCCESS,
    UPDATE_LIMIT_CONFIGURATION_FAILURE,
    GET_LIMIT_CONFIGURATION_BY_ID,
    GET_LIMIT_CONFIGURATION_BY_ID_SUCCESS,
    GET_LIMIT_CONFIGURATION_BY_ID_FAILURE,
    CHANGE_LIMIT_CONFIGURATION,
    CHANGE_LIMIT_CONFIGURATION_SUCCESS,
    CHANGE_LIMIT_CONFIGURATION_FAILURE
} from "../types";

//List LimitConfiguration Action
export const ListLimitConfiguration = request => ({
    type: GET_LIMIT_CONFIGURATION,
    request: request
});
export const ListLimitConfigurationSuccess = response => ({
    type: GET_LIMIT_CONFIGURATION_SUCCESS,
    payload: response
});
export const ListLimitConfigurationFailure = error => ({
    type: GET_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});
//Add LimitConfiguration Action
export const addLimitsConfiguration = request => ({
    type: ADD_LIMIT_CONFIGURATION,
    payload: request
});
export const addLimitsConfigurationSuccess = response => ({
    type: ADD_LIMIT_CONFIGURATION_SUCCESS,
    payload: response
});
export const addLimitsConfigurationFailure = error => ({
    type: ADD_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});
//Get LimitConfiguration Action
export const getLimitConfigurationById = request => ({
    type: GET_LIMIT_CONFIGURATION_BY_ID,
    payload: request
});

export const getLimitConfigurationByIdSuccess = response => ({
    type: GET_LIMIT_CONFIGURATION_BY_ID_SUCCESS,
    payload: response
});

export const getLimitConfigurationByIdFailure = error => ({
    type: GET_LIMIT_CONFIGURATION_BY_ID_FAILURE,
    payload: error
});
//Update LimitConfiguration Action
export const UpdateLimitsConfiguration = data => ({
    type: UPDATE_LIMIT_CONFIGURATION,
    payload: data
});

export const UpdateLimitsConfigurationSuccess = data => ({
    type: UPDATE_LIMIT_CONFIGURATION_SUCCESS,
    payload: data
});

export const UpdateLimitsConfigurationFailure = error => ({
    type: UPDATE_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});
//Delete LimitConfiguration Action
export const ChangeLimitsConfiguration = data => ({
    type: CHANGE_LIMIT_CONFIGURATION,
    payload: data
});

export const ChangeLimitsConfigurationSuccess = data => ({
    type: CHANGE_LIMIT_CONFIGURATION_SUCCESS,
    payload: data
});

export const ChangeLimitsConfigurationFailure = error => ({
    type: CHANGE_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});

