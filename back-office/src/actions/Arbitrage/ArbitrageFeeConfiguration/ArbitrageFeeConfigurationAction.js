/**
 *   Developer : Vishva Shah
 *   Date : 10-06-2019
 *   Component: Arbitrage fee configuration Action
 */
import {

    GET_FEECONFIGURATION,
    GET_FEECONFIGURATION_SUCCESS,
    GET_FEECONFIGURATION_FAILURE,
    //add Master Fee configuration
    ADD_FEECONFIGURATION,
    ADD_FEECONFIGURATION_SUCCESS,
    ADD_FEECONFIGURATION_FAILURE,
    //get Id
    GET_FEECONFIGURATION_BY_ID,
    GET_FEECONFIGURATION_BY_ID_SUCCESS,
    GET_FEECONFIGURATION_BY_ID_FAILURE,
    //update fee configuration
    UPDATE_FEECONFIGURATION,
    UPDATE_FEECONFIGURATION_SUCCESS,
    UPDATE_FEECONFIGURATION_FAILURE,
    //fee configuration details
    GET_FEE_CONFIGURATION_LIST,
    GET_FEE_CONFIGURATION_LIST_SUCCESS,
    GET_FEE_CONFIGURATION_LIST_FAILURE,
    //add fee configuration detail
    ADD_FEE_CONFIGURATION_LIST,
    ADD_FEE_CONFIGURATION_LIST_SUCCESS,
    ADD_FEE_CONFIGURATION_LIST_FAILURE,
    // get by id
    GET_FEE_CONFIGURATIONDETAIL_BYID,
    GET_FEE_CONFIGURATIONDETAIL_BYID_SUCCESS,
    GET_FEE_CONFIGURATIONDETAIL_BYID_FAILURE,
    //update fee configuration detail
    UPDATE_FEE_CONFIGURATION_LIST,
    UPDATE_FEE_CONFIGURATION_LIST_SUCCESS,
    UPDATE_FEE_CONFIGURATION_LIST_FAILURE
} from "Actions/types";

//List ChargeConfiguration Action
export const ListFeeConfiguration = request => ({
    type: GET_FEECONFIGURATION,
    request: request
});
export const ListFeeConfigurationSuccess = response => ({
    type: GET_FEECONFIGURATION_SUCCESS,
    payload: response
});
export const ListFeeConfigurationFailure = error => ({
    type: GET_FEECONFIGURATION_FAILURE,
    payload: error
});
//Add fee configuration Action
export const addFeeConfiguration = request => ({
    type: ADD_FEECONFIGURATION,
    payload: request
});
export const addFeeConfigurationSuccess = response => ({
    type: ADD_FEECONFIGURATION_SUCCESS,
    payload: response
});
export const addFeeConfigurationFailure = error => ({
    type: ADD_FEECONFIGURATION_FAILURE,
    payload: error
});
//Get fee configuration Action
export const getFeeConfigurationById = request => ({
    type: GET_FEECONFIGURATION_BY_ID,
    payload: request
});

export const getFeeConfigurationByIdSuccess = getChargeConfigurationById => ({
    type: GET_FEECONFIGURATION_BY_ID_SUCCESS,
    payload: getChargeConfigurationById
});

export const getFeeConfigurationByIdFailure = error => ({
    type: GET_FEECONFIGURATION_BY_ID_FAILURE,
    payload: error
});
//Update fee Configuration Action
export const UpdateFeeConfiguration = data => ({
    type: UPDATE_FEECONFIGURATION,
    payload: data
});

export const UpdateFeeConfigurationSuccess = data => ({
    type: UPDATE_FEECONFIGURATION_SUCCESS,
    payload: data
});

export const UpdateFeeConfigurationFail = error => ({
    type: UPDATE_FEECONFIGURATION_FAILURE,
    payload: error
});
//fee configuration details action
export const getFeeConfigurationList = data => ({
    type: GET_FEE_CONFIGURATION_LIST,
    payload: data
});

export const getFeeConfigurationListSuccess = response => ({
    type: GET_FEE_CONFIGURATION_LIST_SUCCESS,
    payload: response
});

export const getFeeConfigurationListFailure = error => ({
    type: GET_FEE_CONFIGURATION_LIST_FAILURE,
    payload: error
});
//add action
export const addFeeConfigurationList = data => ({
    type: ADD_FEE_CONFIGURATION_LIST,
    payload: data
});

export const addFeeConfigurationListSuccess = response => ({
    type: ADD_FEE_CONFIGURATION_LIST_SUCCESS,
    payload: response
});

export const addFeeConfigurationListFailure = error => ({
    type: ADD_FEE_CONFIGURATION_LIST_FAILURE,
    payload: error
});
//get ById action
export const getFeeConfigurationDetailById = data => ({
    type: GET_FEE_CONFIGURATIONDETAIL_BYID,
    payload: data
});

export const getFeeConfigurationDetailSuccess = response => ({
    type: GET_FEE_CONFIGURATIONDETAIL_BYID_SUCCESS,
    payload: response
});

export const getFeeConfigurationDetailFailure = error => ({
    type: GET_FEE_CONFIGURATIONDETAIL_BYID_FAILURE,
    payload: error
}); 
//update action
export const updateFeeConfigurationList = data => ({
    type: UPDATE_FEE_CONFIGURATION_LIST,
    payload: data
});

export const updateFeeConfigurationListSuccess = response => ({
    type: UPDATE_FEE_CONFIGURATION_LIST_SUCCESS,
    payload: response
});

export const updateFeeConfigurationListFailure = error => ({
    type: UPDATE_FEE_CONFIGURATION_LIST_FAILURE,
    payload: error
});