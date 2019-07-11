import {
    GET_COMMISSION_TYPE_DETAIL,
    GET_COMMISSION_TYPE_DETAIL_SUCCESS,
    GET_COMMISSION_TYPE_DETAIL_FAILURE,

    UPDATE_COMMISSION_TYPE_STATUS,
    UPDATE_COMMISSION_TYPE_STATUS_SUCCESS,
    UPDATE_COMMISSION_TYPE_STATUS_FAILURE,

    ADD_COMMISSION_TYPE,
    ADD_COMMISSION_TYPE_SUCCESS,
    ADD_COMMISSION_TYPE_FAILURE,

    UPDATE_COMMISSION_TYPE,
    UPDATE_COMMISSION_TYPE_SUCCESS,
    UPDATE_COMMISSION_TYPE_FAILURE
} from "../types";

export const getCommissionType = () => ({
    type: GET_COMMISSION_TYPE_DETAIL
});

export const getCommissionTypeSuccess = getTransactionPolicy => ({
    type: GET_COMMISSION_TYPE_DETAIL_SUCCESS,
    payload: getTransactionPolicy
});

export const getCommissionTypeFailure = error => ({
    type: GET_COMMISSION_TYPE_DETAIL_FAILURE,
    payload: error
});

export const updateCommissionTypeStatus = (data) => ({
    type: UPDATE_COMMISSION_TYPE_STATUS,
    payload: data
});

export const updateCommissionTypeStatusSuccess = (data) => ({
    type: UPDATE_COMMISSION_TYPE_STATUS_SUCCESS,
    payload: data
});

export const updateCommissionTypeStatusFailure = (error) => ({
    type: UPDATE_COMMISSION_TYPE_STATUS_FAILURE,
    payload: error
});

export const addCommissionType = CommissionType => ({
    type: ADD_COMMISSION_TYPE,
    payload: CommissionType
});

export const addCommissionTypeSuccess = CommissionType => ({
    type: ADD_COMMISSION_TYPE_SUCCESS,
    payload: CommissionType
});

export const addCommissionTypeFailure = error => ({
    type: ADD_COMMISSION_TYPE_FAILURE,
    payload: error
});

export const onUpdateCommissionType = updateCommissionType => ({
    type: UPDATE_COMMISSION_TYPE,
    payload: updateCommissionType
});

export const onUpdateCommissionTypeSuccess = updateCommissionType => ({
    type: UPDATE_COMMISSION_TYPE_SUCCESS,
    payload: updateCommissionType
});

export const onUpdateCommissionTypeFail = error => ({
    type: UPDATE_COMMISSION_TYPE_FAILURE,
    payload: error
});

