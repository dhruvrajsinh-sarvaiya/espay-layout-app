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

export const getChargeTypeSuccess = (data) => ({
    type: GET_CHARGE_TYPE_DETAIL_SUCCESS,
    payload: data
});

export const getChargeTypeFailure = (error) => ({
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

export const addChargeType = (data) => ({
    type: ADD_CHARGE_TYPE,
    payload: data
});

export const addChargeTypeSuccess = (data) => ({
    type: ADD_CHARGE_TYPE_SUCCESS,
    payload: data
});

export const addChargeTypeFailure = (error) => ({
    type: ADD_CHARGE_TYPE_FAILURE,
    payload: error
});

export const onUpdateChargeType = (data) => ({
    type: UPDATE_CHARGE_TYPE,
    payload: data
});

export const onUpdateChargeTypeSuccess = (data) => ({
    type: UPDATE_CHARGE_TYPE_SUCCESS,
    payload: data
});

export const onUpdateChargeTypeFail = (error) => ({
    type: UPDATE_CHARGE_TYPE_FAILURE,
    payload: error
});
