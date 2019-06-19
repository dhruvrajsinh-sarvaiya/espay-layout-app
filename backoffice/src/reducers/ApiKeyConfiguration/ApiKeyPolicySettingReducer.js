// Reducer For Handle Api Key Policy Setting By Tejas 14/3/2019
// import types
import {
    GET_API_KEY_POLICY_SETTING,
    GET_API_KEY_POLICY_SETTING_SUCCESS,
    GET_API_KEY_POLICY_SETTING_FAILURE,
    UPDATE_API_KEY_POLICY_SETTING,
    UPDATE_API_KEY_POLICY_SETTING_SUCCESS,
    UPDATE_API_KEY_POLICY_SETTING_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    apiKeyPolicyList: [],
    apiKeyPolicyLoading: false,
    apiKeyPolicyError: [],
    updateApiKeyPolicy: [],
    updateApiKeyPolicyLoading: false,
    updateApiKeyPolicyError: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        // Get Api Key Policy List
        case GET_API_KEY_POLICY_SETTING:
            return { ...state, apiKeyPolicyLoading: true, apiKeyPolicyError: [], apiKeyPolicyList: [] };

        // set Data Of Get Api Key Policy List
        case GET_API_KEY_POLICY_SETTING_SUCCESS:
            return { ...state, apiKeyPolicyList: action.payload.Response, apiKeyPolicyLoading: false, apiKeyPolicyError: [] };

        // Display Error for Get Api Key Policy List failure
        case GET_API_KEY_POLICY_SETTING_FAILURE:
            return { ...state, apiKeyPolicyLoading: false, apiKeyPolicyList: [], apiKeyPolicyError: action.payload };

        // update Api Key Policy List
        case UPDATE_API_KEY_POLICY_SETTING:
            return { ...state, updateApiKeyPolicyLoading: true, updateApiKeyPolicyError: [], updateApiKeyPolicy: [] };

        // set Data Of update Api Key Policy List
        case UPDATE_API_KEY_POLICY_SETTING_SUCCESS:
            return { ...state, updateApiKeyPolicy: action.payload, updateApiKeyPolicyLoading: false, updateApiKeyPolicyError: [] };

        // Display Error for update Api Key Policy List failure
        case UPDATE_API_KEY_POLICY_SETTING_FAILURE:
            return { ...state, updateApiKeyPolicyLoading: false, updateApiKeyPolicy: [], updateApiKeyPolicyError: action.payload };

        default:
            return { ...state };
    }
};
