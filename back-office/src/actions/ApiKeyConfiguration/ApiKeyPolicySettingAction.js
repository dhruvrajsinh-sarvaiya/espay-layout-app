// Actions For Api key Policy Setting By Tejas 14/3/2019

// import types
import {
    GET_API_KEY_POLICY_SETTING,
    GET_API_KEY_POLICY_SETTING_SUCCESS,
    GET_API_KEY_POLICY_SETTING_FAILURE,
    UPDATE_API_KEY_POLICY_SETTING,
    UPDATE_API_KEY_POLICY_SETTING_SUCCESS,
    UPDATE_API_KEY_POLICY_SETTING_FAILURE,
} from "Actions/types";

//action for Get Api Key Policy Setting and set type for reducers
export const getApiKeyPolicySetting = Data => ({
    type: GET_API_KEY_POLICY_SETTING,
    payload: Data
});

//action for set Success and Get Api Key Policy Setting and set type for reducers
export const getApiKeyPolicySettingSuccess = response => ({
    type: GET_API_KEY_POLICY_SETTING_SUCCESS,
    payload: response
});

//action for set failure and error to Get Api Key Policy Setting and set type for reducers
export const getApiKeyPolicySettingFailure = error => ({
    type: GET_API_KEY_POLICY_SETTING_FAILURE,
    payload: error
});

//action for Update Api Key Policy Setting and set type for reducers
export const updateApiKeyPolicySetting = Data => ({
    type: UPDATE_API_KEY_POLICY_SETTING,
    payload: Data
});

//action for set Success and Update Api Key Policy Setting and set type for reducers
export const updateApiKeyPolicySettingSuccess = response => ({
    type: UPDATE_API_KEY_POLICY_SETTING_SUCCESS,
    payload: response
});

//action for set failure and error to Update Api Key Policy Setting and set type for reducers
export const updateApiKeyPolicySettingFailure = error => ({
    type: UPDATE_API_KEY_POLICY_SETTING_FAILURE,
    payload: error
});