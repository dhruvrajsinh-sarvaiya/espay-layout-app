// ApiKeyPolicySettingAction.js
import {
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
} from '../ActionTypes'
import { action } from '../GlobalActions'

// Redux Action for Api Key Policy Setting
export function getApiKeyPolicy() {
    return action(GET_PUBLIC_API_KEY_POLICY)
}

// Redux Action for Api Key Policy Setting success
export function getApiKeyPolicySuccess(data) {
    return action(GET_PUBLIC_API_KEY_POLICY_SUCCESS, { data })
}

// Redux Action for Api Key Policy Setting failure
export function getApiKeyPolicyFailure() {
    return action(GET_PUBLIC_API_KEY_POLICY_FAILURE)
}

// Redux Action for Update Api Key Policy Setting
export function updateApiKeyPolicy(payload = {}) {
    return action(UPDATE_PUBLIC_API_KEY_POLICY, { payload })
}

// Redux Action for Update Api Key Policy Setting success
export function updateApiKeyPolicySuccess(data) {
    return action(UPDATE_PUBLIC_API_KEY_POLICY_SUCCESS, { data })
}

// Redux Action for Update Api Key Policy Setting failure
export function updateApiKeyPolicyFailure() {
    return action(UPDATE_PUBLIC_API_KEY_POLICY_FAILURE)
}

// Redux Action for clear Api Key Policy Setting
export function clearApiKeyPolicy() {
    return action(CLEAR_PUBLIC_API_KEY_POLICY)
}