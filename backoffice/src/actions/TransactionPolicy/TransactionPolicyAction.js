import {
    GET_TRANSACTION_POLICY,
    GET_TRANSACTION_POLICY_SUCCESS,
    GET_TRANSACTION_POLICY_FAILURE,

    UPDATE_TRANSACTION_POLICY_STATUS,
    UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS,
    UPDATE_TRANSACTION_POLICY_STATUS_FAILURE,

    ADD_TRANSACTION_POLICY,
    ADD_TRANSACTION_POLICY_SUCCESS,
    ADD_TRANSACTION_POLICY_FAILURE,

    UPDATE_TRANSACTION_POLICY,
    UPDATE_TRANSACTION_POLICY_SUCCESS,
    UPDATE_TRANSACTION_POLICY_FAILURE,

    GET_WALLET_TRANSACTION_TYPE,
    GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    GET_WALLET_TRANSACTION_TYPE_FAILURE,

    GET_ROLE_DETAILS,
    GET_ROLE_DETAILS_SUCCESS,
    GET_ROLE_DETAILS_FAILURE
} from "../types";

export const getTransactionPolicy = () => ({
    type: GET_TRANSACTION_POLICY
});

export const getTransactionPolicySuccess = getTransactionPolicy => ({
    type: GET_TRANSACTION_POLICY_SUCCESS,
    payload: getTransactionPolicy
});

export const getTransactionPolicyFailure = error => ({
    type: GET_TRANSACTION_POLICY_FAILURE,
    payload: error
});

export const updateTransactionPolicyStatus = (data) => ({
    type: UPDATE_TRANSACTION_POLICY_STATUS,
    payload: data
});

export const updateTransactionPolicyStatusSuccess = (data) => ({
    type: UPDATE_TRANSACTION_POLICY_STATUS_SUCCESS,
    payload: data
});

export const updateTransactionPolicyStatusFailure = (error) => ({
    type: UPDATE_TRANSACTION_POLICY_STATUS_FAILURE,
    payload: error
});

export const addTransactionPolicy = transactionPolicy => ({
    type: ADD_TRANSACTION_POLICY,
    payload: transactionPolicy
});

export const addTransactionPolicySuccess = transactionPolicy => ({
    type: ADD_TRANSACTION_POLICY_SUCCESS,
    payload: transactionPolicy
});

export const addtransactionPolicyFailure = error => ({
    type: ADD_TRANSACTION_POLICY_FAILURE,
    payload: error
});

export const onUpdateTransactionPolicy = updateTransactionPolicy => ({
    type: UPDATE_TRANSACTION_POLICY,
    payload: updateTransactionPolicy
});

export const onUpdateTransactionPolicySuccess = updateTransactionPolicy => ({
    type: UPDATE_TRANSACTION_POLICY_SUCCESS,
    payload: updateTransactionPolicy
});

export const onUpdateTransactionPolicyFail = error => ({
    type: UPDATE_TRANSACTION_POLICY_FAILURE,
    payload: error
});

export const getWalletTransactionType = () => ({
    type: GET_WALLET_TRANSACTION_TYPE
});

export const getWalletTransactionTypeSuccess = getWalletTransactionType => ({
    type: GET_WALLET_TRANSACTION_TYPE_SUCCESS,
    payload: getWalletTransactionType
});

export const getWalletTransactionTypeFailure = error => ({
    type: GET_WALLET_TRANSACTION_TYPE_FAILURE,
    payload: error
});

export const getRoleDetails = () => ({
    type: GET_ROLE_DETAILS
});

export const getRoleDetailsSuccess = getRoleDetails => ({
    type: GET_ROLE_DETAILS_SUCCESS,
    payload: getRoleDetails
});

export const getRoleDetailsFailure = error => ({
    type: GET_ROLE_DETAILS_FAILURE,
    payload: error
});
