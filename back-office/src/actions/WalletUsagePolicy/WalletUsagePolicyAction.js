import {
    GET_WALLET_USAGE_POLICY,
    GET_WALLET_USAGE_POLICY_SUCCESS,
    GET_WALLET_USAGE_POLICY_FAILURE,

    UPDATE_WALLET_USAGE_POLICY_STATUS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE,

    ADD_WALLET_USAGE_POLICY,
    ADD_WALLET_USAGE_POLICY_SUCCESS,
    ADD_WALLET_USAGE_POLICY_FAILURE,

    UPDATE_WALLET_USAGE_POLICY,
    UPDATE_WALLET_USAGE_POLICY_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_FAILURE,

    GET_WALLET_TYPE,
    GET_WALLET_TYPE_SUCCESS,
    GET_WALLET_TYPE_FAILURE
} from "../types";

export const getWalletUsagePolicy = () => ({
    type: GET_WALLET_USAGE_POLICY
});

export const getWalletUsagePolicySuccess = data => ({
    type: GET_WALLET_USAGE_POLICY_SUCCESS,
    payload: data
});

export const getWalletUsagePolicyFailure = error => ({
    type: GET_WALLET_USAGE_POLICY_FAILURE,
    payload: error
});

export const updateWalletUsagePolicyStatus = (data) => ({
    type: UPDATE_WALLET_USAGE_POLICY_STATUS,
    payload: data
});

export const updateWalletUsagePolicyStatusSuccess = (data) => ({
    type: UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS,
    payload: data
});

export const updateWalletUsagePolicyStatusFailure = (error) => ({
    type: UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE,
    payload: error
});

export const addWalletUsagePolicy = walletUsagePolicy => ({
    type: ADD_WALLET_USAGE_POLICY,
    payload: walletUsagePolicy
});

export const addWalletUsagePolicySuccess = walletUsagePolicy => ({
    type: ADD_WALLET_USAGE_POLICY_SUCCESS,
    payload: walletUsagePolicy
});

export const addWalletUsagePolicyFailure = error => ({
    type: ADD_WALLET_USAGE_POLICY_FAILURE,
    payload: error
});

export const onUpdateWalletUsagePolicy = updateCommissionType => ({
    type: UPDATE_WALLET_USAGE_POLICY,
    payload: updateCommissionType
});

export const onUpdateWalletUsagePolicySuccess = updateCommissionType => ({
    type: UPDATE_WALLET_USAGE_POLICY_SUCCESS,
    payload: updateCommissionType
});

export const onUpdateWalletUsagePolicyFail = error => ({
    type: UPDATE_WALLET_USAGE_POLICY_FAILURE,
    payload: error
});

export const getWalletType = (request) => ({
    type: GET_WALLET_TYPE,
    payload: request
});

export const getWalletTypeSuccess = Data => ({
    type: GET_WALLET_TYPE_SUCCESS,
    payload: Data
});

export const getWalletTypeFailure = error => ({
    type: GET_WALLET_TYPE_FAILURE,
    payload: error
});