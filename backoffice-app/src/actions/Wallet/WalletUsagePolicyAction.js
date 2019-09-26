import {
    //wallet policy list
    GET_WALLET_USAGE_POLICY,
    GET_WALLET_USAGE_POLICY_SUCCESS,
    GET_WALLET_USAGE_POLICY_FAILURE,

    //update wallet policy status delete
    UPDATE_WALLET_USAGE_POLICY_STATUS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE,

    //Add wallet policy 
    ADD_WALLET_USAGE_POLICY,
    ADD_WALLET_USAGE_POLICY_SUCCESS,
    ADD_WALLET_USAGE_POLICY_FAILURE,

    //update wallet policy 
    UPDATE_WALLET_USAGE_POLICY,
    UPDATE_WALLET_USAGE_POLICY_SUCCESS,
    UPDATE_WALLET_USAGE_POLICY_FAILURE,

    //for clear response
    CLEAR_WALLET_POLICY,
} from '../ActionTypes'

//Redux action for Wallet Usage policy list
export const getWalletUsagePolicy = (data) => ({
    type: GET_WALLET_USAGE_POLICY,
    payload: data
});

//Redux action for Wallet Usage policy list Success
export const getWalletUsagePolicySuccess = (response) => ({
    type: GET_WALLET_USAGE_POLICY_SUCCESS,
    payload: response
});

//Redux action for Wallet Usage policy list failure
export const getWalletUsagePolicyFailure = (error) => ({
    type: GET_WALLET_USAGE_POLICY_FAILURE,
    payload: error
});

//Redux action for update Wallet Usage policy status delete
export const updateWalletUsagePolicyStatus = (data) => ({
    type: UPDATE_WALLET_USAGE_POLICY_STATUS,
    payload: data
});

//Redux action for update Wallet Usage policy status delete Sucess
export const updateWalletUsagePolicyStatusSuccess = (data) => ({
    type: UPDATE_WALLET_USAGE_POLICY_STATUS_SUCCESS,
    payload: data
});

//Redux action for update Wallet Usage policy status delete failure
export const updateWalletUsagePolicyStatusFailure = (error) => ({
    type: UPDATE_WALLET_USAGE_POLICY_STATUS_FAILURE,
    payload: error
});

//Redux action Add Wallet Usage policy 
export const addWalletUsagePolicy = (walletUsagePolicy) => ({
    type: ADD_WALLET_USAGE_POLICY,
    payload: walletUsagePolicy
});

//Redux action Add Wallet Usage policy Success
export const addWalletUsagePolicySuccess = (response) => ({
    type: ADD_WALLET_USAGE_POLICY_SUCCESS,
    payload: response
});

//Redux action Add Wallet Usage policy failure
export const addWalletUsagePolicyFailure = (error) => ({
    type: ADD_WALLET_USAGE_POLICY_FAILURE,
    payload: error
});

//Redux action update Wallet Usage policy 
export const onUpdateWalletUsagePolicy = (updateCommissionType) => ({
    type: UPDATE_WALLET_USAGE_POLICY,
    payload: updateCommissionType
});

//Redux action update Wallet Usage policy Success
export const onUpdateWalletUsagePolicySuccess = (response) => ({
    type: UPDATE_WALLET_USAGE_POLICY_SUCCESS,
    payload: response
});

//Redux action update Wallet Usage policy failure
export const onUpdateWalletUsagePolicyFail = (error) => ({
    type: UPDATE_WALLET_USAGE_POLICY_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearWalletPolicy = () => ({
    type: CLEAR_WALLET_POLICY,
});




