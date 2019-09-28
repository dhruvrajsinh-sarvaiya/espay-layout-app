import {
    // Get Charge Congif List
    GET_CHARGE_CONFIG_LIST,
    GET_CHARGE_CONFIG_LIST_SUCCESS,
    GET_CHARGE_CONFIG_LIST_FAILURE,

    // Delete Charge Config Data
    DELETE_CHARGE_CONFIG_DATA,
    DELETE_CHARGE_CONFIG_DATA_SUCCESS,
    DELETE_CHARGE_CONFIG_DATA_FAILURE,

    // Clear Charge Config Data
    CLEAR_CHARGE_CONFIG_DATA,

    // add Charge Config Data
    ADD_CHARGECONFIGURATION,
    ADD_CHARGECONFIGURATION_SUCCESS,
    ADD_CHARGECONFIGURATION_FAILURE,

    // update Charge Config Data
    UPDATE_CHARGECONFIGURATION,
    UPDATE_CHARGECONFIGURATION_SUCCESS,
    UPDATE_CHARGECONFIGURATION_FAILURE,

    // Get Charge Congif detail List
    GET_CHARGE_CONFIG_DETAIL,
    GET_CHARGE_CONFIG_DETAIL_SUCCESS,
    GET_CHARGE_CONFIG_DETAIL_FAILURE,

    // add Charge Congif detail List
    ADD_CHARGECONFIGURATION_DETAIL,
    ADD_CHARGECONFIGURATION_DETAIL_SUCCESS,
    ADD_CHARGECONFIGURATION_DETAIL_FAILURE,

    // update Charge Congif detail List
    UPDATE_CHARGECONFIGURATION_DETAIL,
    UPDATE_CHARGECONFIGURATION_DETAIL_SUCCESS,
    UPDATE_CHARGECONFIGURATION_DETAIL_FAILURE,
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Charge Configuration List
export function getChargeConfigList() {
    return action(GET_CHARGE_CONFIG_LIST)
}

// Redux action for Get Charge Configuration List Success
export function getChargeConfigListSuccess(data) {
    return action(GET_CHARGE_CONFIG_LIST_SUCCESS, { data })
}

// Redux action for Get Charge Configuration List Success
export function getChargeConfigListFailure() {
    return action(GET_CHARGE_CONFIG_LIST_FAILURE)
}

// Redux action for Delete Charge Configuration Data
export function deleteChargeConfigData(payload) {
    return action(DELETE_CHARGE_CONFIG_DATA, { payload })
}

// Redux action for Delete Charge Configuration Data Success
export function deleteChargeConfigDataSuccess(data) {
    return action(DELETE_CHARGE_CONFIG_DATA_SUCCESS, { data })
}

// Redux action for Delete Charge Configuration Data Success
export function deleteChargeConfigDataFailure() {
    return action(DELETE_CHARGE_CONFIG_DATA_FAILURE)
}

// Redux action for Clear Charge Configuration Data
export function clearChargeConfigData() {
    return action(CLEAR_CHARGE_CONFIG_DATA)
}

//Redux action for add Charge Configuration Data
export const addChargesConfiguration = data => ({
    type: ADD_CHARGECONFIGURATION,
    payload: data
});

// Redux action for add Charge Configuration Data Success
export const addChargesConfigurationSuccess = response => ({
    type: ADD_CHARGECONFIGURATION_SUCCESS,
    payload: response
});

// Redux action for add Charge Configuration Data Failure
export const addChargesConfigurationFailure = error => ({
    type: ADD_CHARGECONFIGURATION_FAILURE,
    payload: error
});

//Redux action for update Charge Configuration Data
export const UpdateChargesConfiguration = data => ({
    type: UPDATE_CHARGECONFIGURATION,
    payload: data
});

// Redux action for update Charge Configuration Data Success
export const UpdateChargesConfigurationSuccess = data => ({
    type: UPDATE_CHARGECONFIGURATION_SUCCESS,
    payload: data
});

// Redux action for update Charge Configuration Data Failure
export const UpdateChargesConfigurationFail = error => ({
    type: UPDATE_CHARGECONFIGURATION_FAILURE,
    payload: error
});

// Redux action for Get Charge Configuration List
export const getChargeConfigDetail = data => ({
    type: GET_CHARGE_CONFIG_DETAIL,
    payload: data
});

// Redux action for Get Charge Configuration List Success
export const getChargeConfigDetailSuccess = response => ({
    type: GET_CHARGE_CONFIG_DETAIL_SUCCESS,
    payload: response
});

// Redux action for Get Charge Configuration List failure
export const getChargeConfigDetailFailure = error => ({
    type: GET_CHARGE_CONFIG_DETAIL_FAILURE,
    payload: error
});

//Redux action for add Charge Configuration Data
export const addChargesConfigurationDetail = data => ({
    type: ADD_CHARGECONFIGURATION_DETAIL,
    payload: data
});

// Redux action for add Charge Configuration Data Success
export const addChargesConfigurationDetailSuccess = response => ({
    type: ADD_CHARGECONFIGURATION_DETAIL_SUCCESS,
    payload: response
});

// Redux action for add Charge Configuration Data Failure
export const addChargesConfigurationDetailFailure = error => ({
    type: ADD_CHARGECONFIGURATION_DETAIL_FAILURE,
    payload: error
});

//Redux action for update Charge Configuration Data
export const UpdateChargesConfigurationDetail = data => ({
    type: UPDATE_CHARGECONFIGURATION_DETAIL,
    payload: data
});

// Redux action for update Charge Configuration Data Success
export const UpdateChargesConfigurationDetailSuccess = data => ({
    type: UPDATE_CHARGECONFIGURATION_DETAIL_SUCCESS,
    payload: data
});

// Redux action for update Charge Configuration Data Failure
export const UpdateChargesConfigurationDetailFail = error => ({
    type: UPDATE_CHARGECONFIGURATION_DETAIL_FAILURE,
    payload: error
});
