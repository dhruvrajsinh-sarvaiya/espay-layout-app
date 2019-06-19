import {
    GET_CHARGE_TYPE_DETAIL,
    GET_CHARGE_TYPE_DETAIL_SUCCESS,
    GET_CHARGE_TYPE_DETAIL_FAILURE,

    UPDATE_CHARGE_TYPE_STATUS,
    UPDATE_CHARGE_TYPE_STATUS_SUCCESS,
    UPDATE_CHARGE_TYPE_STATUS_FAILURE,

    ADD_CHARGE_TYPE,
    ADD_CHARGE_TYPE_SUCCESS,
    ADD_CHARGE_TYPE_FAILURE,

    UPDATE_CHARGE_TYPE,
    UPDATE_CHARGE_TYPE_SUCCESS,
    UPDATE_CHARGE_TYPE_FAILURE
} from "../types";

export const getChargeType = () => ({
    type: GET_CHARGE_TYPE_DETAIL
});

export const getChargeTypeSuccess = getChargeType => ({
    type: GET_CHARGE_TYPE_DETAIL_SUCCESS,
    payload: getChargeType
});

export const getChargeTypeFailure = error => ({
    type: GET_CHARGE_TYPE_DETAIL_FAILURE,
    payload: error
});

export const updateChargeTypeStatus = (data) => ({
    type: UPDATE_CHARGE_TYPE_STATUS,
    payload: data
});

export const updateChargeTypeStatusSuccess = (data) => ({
    type: UPDATE_CHARGE_TYPE_STATUS_SUCCESS,
    payload: data
});

export const updateChargeTypeStatusFailure = (error) => ({
    type: UPDATE_CHARGE_TYPE_STATUS_FAILURE,
    payload: error
});

export const addChargeType = ChargeType => ({
    type: ADD_CHARGE_TYPE,
    payload: ChargeType
});

export const addChargeTypeSuccess = ChargeType => ({
    type: ADD_CHARGE_TYPE_SUCCESS,
    payload: ChargeType
});

export const addChargeTypeFailure = error => ({
    type: ADD_CHARGE_TYPE_FAILURE,
    payload: error
});

export const onUpdateChargeType = updateChargeType => ({
    type: UPDATE_CHARGE_TYPE,
    payload: updateChargeType
});

export const onUpdateChargeTypeSuccess = updateChargeType => ({
    type: UPDATE_CHARGE_TYPE_SUCCESS,
    payload: updateChargeType
});

export const onUpdateChargeTypeFail = error => ({
    type: UPDATE_CHARGE_TYPE_FAILURE,
    payload: error
});

