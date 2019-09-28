import {
    // Get limit configuration List
    GET_LIMIT_CONFIGURATION,
    GET_LIMIT_CONFIGURATION_SUCCESS,
    GET_LIMIT_CONFIGURATION_FAILURE,

    // add limit configuration 
    ADD_LIMIT_CONFIGURATION,
    ADD_LIMIT_CONFIGURATION_SUCCESS,
    ADD_LIMIT_CONFIGURATION_FAILURE,

    // update limit configuration 
    UPDATE_LIMIT_CONFIGURATION,
    UPDATE_LIMIT_CONFIGURATION_SUCCESS,
    UPDATE_LIMIT_CONFIGURATION_FAILURE,

    // for delete limit configuration 
    CHANGE_LIMIT_CONFIGURATION,
    CHANGE_LIMIT_CONFIGURATION_SUCCESS,
    CHANGE_LIMIT_CONFIGURATION_FAILURE,

    //for clear reducer data
    CLEAR_LIMIT_CONFIGURATION,
} from '../ActionTypes'

// Redux action for Get limit configuration List
export const getLimitConfigList = request => ({
    type: GET_LIMIT_CONFIGURATION,
    request: request
});

// Redux action for Get limit configuration list Success
export const getLimitConfigListSuccess = response => ({
    type: GET_LIMIT_CONFIGURATION_SUCCESS,
    payload: response
});

// Redux action for Get limit configuration list failure
export const getLimitConfigListFailure = error => ({
    type: GET_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});

// Redux action for add limit configuration 
export const addLimitsConfiguration = request => ({
    type: ADD_LIMIT_CONFIGURATION,
    payload: request
});

// Redux action for add limit configuration Success
export const addLimitsConfigurationSuccess = response => ({
    type: ADD_LIMIT_CONFIGURATION_SUCCESS,
    payload: response
});

// Redux action for add limit configuration failure
export const addLimitsConfigurationFailure = error => ({
    type: ADD_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});

// Redux action for update limit configuration 
export const UpdateLimitsConfiguration = data => ({
    type: UPDATE_LIMIT_CONFIGURATION,
    payload: data
});

// Redux action for update limit configuration Success
export const UpdateLimitsConfigurationSuccess = data => ({
    type: UPDATE_LIMIT_CONFIGURATION_SUCCESS,
    payload: data
});

// Redux action for update limit configuration Success
export const UpdateLimitsConfigurationFailure = error => ({
    type: UPDATE_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});

// Redux action for delete limit configuration 
export const ChangeLimitsConfiguration = data => ({
    type: CHANGE_LIMIT_CONFIGURATION,
    payload: data
});

// Redux action for delete limit configuration Success
export const ChangeLimitsConfigurationSuccess = data => ({
    type: CHANGE_LIMIT_CONFIGURATION_SUCCESS,
    payload: data
});

// Redux action for delete limit configuration Failure
export const ChangeLimitsConfigurationFailure = error => ({
    type: CHANGE_LIMIT_CONFIGURATION_FAILURE,
    payload: error
});

//clear limit config data
export const clearLimitConfigured = () => ({
    type: CLEAR_LIMIT_CONFIGURATION,
});

