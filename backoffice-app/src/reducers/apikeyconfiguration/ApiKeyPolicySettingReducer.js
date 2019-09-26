// ApiKeyPolicySettingReducer.js
import {
    // logout action 
    ACTION_LOGOUT,

    // for Api Key Policy Setting
    GET_PUBLIC_API_KEY_POLICY,
    GET_PUBLIC_API_KEY_POLICY_SUCCESS,
    GET_PUBLIC_API_KEY_POLICY_FAILURE,

    // for Update Api Key Policy Setting
    UPDATE_PUBLIC_API_KEY_POLICY,
    UPDATE_PUBLIC_API_KEY_POLICY_SUCCESS,
    UPDATE_PUBLIC_API_KEY_POLICY_FAILURE,

    // for Clear Api Key Policy Setting
    CLEAR_PUBLIC_API_KEY_POLICY
} from '../../actions/ActionTypes'

// Initial State for Api Key Policy Setting
const INITIAL_STATE = {

    // for Api Key Policy Setting
    ApiKeyPolicySettingData: null,
    ApiKeyPolicySettingLoading: false,

    // for Update Api Key Policy Setting
    updateApiKeyPolicySetting: null,
    updateApiKeyPolicySettingLoading: false,
}

export default function ApiKeyPolicySettingReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // Handle Api Key Policy Setting method data
        case GET_PUBLIC_API_KEY_POLICY:
            return Object.assign({}, state, {
                ApiKeyPolicySettingData: null,
                ApiKeyPolicySettingLoading: true
            })
        // Set Api Key Policy Setting success data
        case GET_PUBLIC_API_KEY_POLICY_SUCCESS:
            return Object.assign({}, state, {
                ApiKeyPolicySettingData: action.data,
                ApiKeyPolicySettingLoading: false,
            })
        // Set Api Key Policy Setting failure data
        case GET_PUBLIC_API_KEY_POLICY_FAILURE:
            return Object.assign({}, state, {
                ApiKeyPolicySettingData: null,
                ApiKeyPolicySettingLoading: false,
            })

        // Handle Update Api Key Policy Setting method data
        case UPDATE_PUBLIC_API_KEY_POLICY:
            return Object.assign({}, state, {
                updateApiKeyPolicySetting: null,
                updateApiKeyPolicySettingLoading: true
            })
        // Set Update Api Key Policy Setting success data
        case UPDATE_PUBLIC_API_KEY_POLICY_SUCCESS:
            return Object.assign({}, state, {
                updateApiKeyPolicySetting: action.data,
                updateApiKeyPolicySettingLoading: false,
            })
        // Set Update Api Key Policy Setting failure data
        case UPDATE_PUBLIC_API_KEY_POLICY_FAILURE:
            return Object.assign({}, state, {
                updateApiKeyPolicySetting: null,
                updateApiKeyPolicySettingLoading: false,
            })

        // for Clear Api Key Policy Setting Data
        case CLEAR_PUBLIC_API_KEY_POLICY:
            return INITIAL_STATE

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}