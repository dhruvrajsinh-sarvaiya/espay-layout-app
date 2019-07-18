import {
    // Get Help Manual Module
    GET_HELPMANUALMODUALS,
    GET_HELPMANUALMODUALS_SUCCESS,
    GET_HELPMANUALMODUALS_FAILURE,

    // Get Help Manual By Id
    GET_HELPMANUALS_BY_ID,
    GET_HELPMANUALS_BY_ID_SUCCESS,
    GET_HELPMANUALS_BY_ID_FAILURE
} from '../ActionTypes';

// Redux Action To Get Help Manual Modules Data Action
export const getHelpManualModules = () => ({
    type: GET_HELPMANUALMODUALS,
    payload:{}
});

//  Redux Action To Get Help Manual Modules Data Success Action
export const getHelpManualModulesSuccess = (response) => ({
    type: GET_HELPMANUALMODUALS_SUCCESS,
    payload: response
});

//  Redux Action To Get Help Manual Modules Data Failure Action
export const getHelpManualModulesFailure = (error) => ({
    type: GET_HELPMANUALMODUALS_FAILURE,
    payload: error
});

//  Redux Action To Get Help Manual By Id
export const getHelpManualById = (data) => ({
    type: GET_HELPMANUALS_BY_ID,
    payload : data
});

//  Redux Action To Get Help Manual By Id Success
export const getHelpManualByIdSuccess = (data) => ({
    type: GET_HELPMANUALS_BY_ID_SUCCESS,
    payload: data
});

//  Redux Action To Get Help Manual By Id Failure
export const getHelpManualByIdFailure = (error) => ({
    type: GET_HELPMANUALS_BY_ID_FAILURE,
    payload: error
});