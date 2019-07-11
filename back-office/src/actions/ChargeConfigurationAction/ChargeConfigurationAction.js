

/**
 *   Developer : Parth Andhariya
 *   Date : 19-03-2019
 *   Component: Charge Configuration Action
 */
import {
    GET_CHARGECONFIGURATION,
    GET_CHARGECONFIGURATION_SUCCESS,
    GET_CHARGECONFIGURATION_FAILURE,
    ADD_CHARGECONFIGURATION,
    ADD_CHARGECONFIGURATION_SUCCESS,
    ADD_CHARGECONFIGURATION_FAILURE,
    UPDATE_CHARGECONFIGURATION,
    UPDATE_CHARGECONFIGURATION_SUCCESS,
    UPDATE_CHARGECONFIGURATION_FAILURE,
    GET_CHARGECONFIGURATION_BY_ID,
    GET_CHARGECONFIGURATION_BY_ID_SUCCESS,
    GET_CHARGECONFIGURATION_BY_ID_FAILURE,
    GET_CHARGE_CONFIGURATION_LIST,
    GET_CHARGE_CONFIGURATION_LIST_SUCCESS,
    GET_CHARGE_CONFIGURATION_LIST_FAILURE,
    ADD_CHARGE_CONFIGURATION_LIST,
    ADD_CHARGE_CONFIGURATION_LIST_SUCCESS,
    ADD_CHARGE_CONFIGURATION_LIST_FAILURE,
    GET_CHARGE_CONFIGURATION_BYID,
    GET_CHARGE_CONFIGURATION_BYID_SUCCESS,
    GET_CHARGE_CONFIGURATION_BYID_FAILURE,
    UPDATE_CHARGE_CONFIGURATION_LIST,
    UPDATE_CHARGE_CONFIGURATION_LIST_SUCCESS,
    UPDATE_CHARGE_CONFIGURATION_LIST_FAILURE
} from "../types";

//List ChargeConfiguration Action
export const ListChargeConfiguration = request => ({
    type: GET_CHARGECONFIGURATION,
    request: request
});
export const ListChargeConfigurationSuccess = response => ({
    type: GET_CHARGECONFIGURATION_SUCCESS,
    payload: response
});
export const ListChargeConfigurationFailure = error => ({
    type: GET_CHARGECONFIGURATION_FAILURE,
    payload: error
});
//Add ChargeConfiguration Action
export const addChargesConfiguration = request => ({
    type: ADD_CHARGECONFIGURATION,
    payload: request
});
export const addChargesConfigurationSuccess = response => ({
    type: ADD_CHARGECONFIGURATION_SUCCESS,
    payload: response
});
export const addChargesConfigurationFailure = error => ({
    type: ADD_CHARGECONFIGURATION_FAILURE,
    payload: error
});
//Get ChargeConfiguration Action
export const getChargeConfigurationById = request => ({
    type: GET_CHARGECONFIGURATION_BY_ID,
    payload: request
});

export const getChargeConfigurationByIdSuccess = response => ({
    type: GET_CHARGECONFIGURATION_BY_ID_SUCCESS,
    payload: response
});

export const getChargeConfigurationByIdFailure = error => ({
    type: GET_CHARGECONFIGURATION_BY_ID_FAILURE,
    payload: error
});
//Update ChargeConfiguration Action
export const UpdateChargesConfiguration = data => ({
    type: UPDATE_CHARGECONFIGURATION,
    payload: data
});

export const UpdateChargesConfigurationSuccess = data => ({
    type: UPDATE_CHARGECONFIGURATION_SUCCESS,
    payload: data
});

export const UpdateChargesConfigurationFail = error => ({
    type: UPDATE_CHARGECONFIGURATION_FAILURE,
    payload: error
});

//detail actions
//get action
export const getChargeConfigurationList = data => ({
    type: GET_CHARGE_CONFIGURATION_LIST,
    payload: data
});

export const getChargeConfigurationListSuccess = response => ({
    type: GET_CHARGE_CONFIGURATION_LIST_SUCCESS,
    payload: response
});

export const getChargeConfigurationListFailure = error => ({
    type: GET_CHARGE_CONFIGURATION_LIST_FAILURE,
    payload: error
});

//add action
export const addChargeConfigurationList = data => ({
    type: ADD_CHARGE_CONFIGURATION_LIST,
    payload: data
});

export const addChargeConfigurationListSuccess = response => ({
    type: ADD_CHARGE_CONFIGURATION_LIST_SUCCESS,
    payload: response
});

export const addChargeConfigurationListFailure = error => ({
    type: ADD_CHARGE_CONFIGURATION_LIST_FAILURE,
    payload: error
});

//get ById action
export const getChargeConfigurationDetailById = data => ({
    type: GET_CHARGE_CONFIGURATION_BYID,
    payload: data
});

export const getChargeConfigurationDetailSuccess = response => ({
    type: GET_CHARGE_CONFIGURATION_BYID_SUCCESS,
    payload: response
});

export const getChargeConfigurationDetailFailure = error => ({
    type: GET_CHARGE_CONFIGURATION_BYID_FAILURE,
    payload: error
});

//update action
export const updateChargeConfigurationList = data => ({
    type: UPDATE_CHARGE_CONFIGURATION_LIST,
    payload: data
});

export const updateChargeConfigurationListSuccess = response => ({
    type: UPDATE_CHARGE_CONFIGURATION_LIST_SUCCESS,
    payload: response
});

export const updateChargeConfigurationListFailure = error => ({
    type: UPDATE_CHARGE_CONFIGURATION_LIST_FAILURE,
    payload: error
});
