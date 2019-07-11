import {

    GET_WALLET_TYPE_MASTER,
    GET_WALLET_TYPE_MASTERL_SUCCESS,
    GET_WALLET_TYPE_MASTER_FAILURE,

    DELETE_WALLET_TYPE_MASTER,
    DELETE_WALLET_TYPE_MASTER_SUCCESS,
    DELETE_WALLET_TYPE_MASTER_FAILURE,

    ADD_WALLET_TYPE_MASTER,
    ADD_WALLET_TYPE_MASTER_SUCCESS,
    ADD_WALLET_TYPE_MASTER_FAILURE,

    UPDATE_WALLET_TYPE_MASTER,
    UPDATE_WALLET_TYPE_MASTER_SUCCESS,
    UPDATE_WALLET_TYPE_MASTER_FAILURE,

    GET_WALLET_TYPE_MASTER_BY_ID,
    GET_WALLET_TYPE_MASTER_BY_ID_SUCCESS,
    GET_WALLET_TYPE_MASTER_BY_ID_FAILURE

} from "../types";

export const getWalletTypeMaster = () => ({
    type: GET_WALLET_TYPE_MASTER
});

export const getWalletTypeMasterSuccess = response => ({
    type: GET_WALLET_TYPE_MASTERL_SUCCESS,
    payload: response
});

export const getWalletTypeMasterFailure = error => ({
    type: GET_WALLET_TYPE_MASTER_FAILURE,
    payload: error
});

export const getWalletTypeMasterById = (request) => ({
    type: GET_WALLET_TYPE_MASTER_BY_ID,
    payload: request
});

export const getWalletTypeMasterByIdSuccess = response => ({
    type: GET_WALLET_TYPE_MASTER_BY_ID_SUCCESS,
    payload: response
});

export const getWalletTypeMasterByIdFailure = error => ({
    type: GET_WALLET_TYPE_MASTER_BY_ID_FAILURE,
    payload: error
});

export const deleteWalletTypeMaster = (request) => ({
    type: DELETE_WALLET_TYPE_MASTER,
    payload: request
});

export const deleteWalletTypeMasterSuccess = response => ({
    type: DELETE_WALLET_TYPE_MASTER_SUCCESS,
    payload: response
});

export const deleteWalletTypeMasterFailure = error => ({
    type: DELETE_WALLET_TYPE_MASTER_FAILURE,
    payload: error
});

export const addWalletTypeMaster = WalletTypeMaster => ({
    type: ADD_WALLET_TYPE_MASTER,
    payload: WalletTypeMaster
});

export const addWalletTypeMasterSuccess = WalletTypeMaster => ({
    type: ADD_WALLET_TYPE_MASTER_SUCCESS,
    payload: WalletTypeMaster
});

export const addWalletTypeMasterFailure = error => ({
    type: ADD_WALLET_TYPE_MASTER_FAILURE,
    payload: error
});

export const onUpdateWalletTypeMaster = updateWalletTypeMaster => ({
    type: UPDATE_WALLET_TYPE_MASTER,
    payload: updateWalletTypeMaster
});

export const onUpdateWalletTypeMasterSuccess = updateWalletTypeMaster => ({
    type: UPDATE_WALLET_TYPE_MASTER_SUCCESS,
    payload: updateWalletTypeMaster
});

export const onUpdateWalletTypeMasterFail = error => ({
    type: UPDATE_WALLET_TYPE_MASTER_FAILURE,
    payload: error
});


