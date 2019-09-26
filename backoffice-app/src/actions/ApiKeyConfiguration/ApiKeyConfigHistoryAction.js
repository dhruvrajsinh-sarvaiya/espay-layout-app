import { 
    // Get Api Key Configuration History
    GET_API_KEY_CONFIG_HISTORY, 
    GET_API_KEY_CONFIG_HISTORY_SUCCESS, 
    GET_API_KEY_CONFIG_HISTORY_FAILURE, 

    // Clear Api Key Configuration History
    CLEAR_API_KEY_CONFIG_HISTORY 
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Api Key Configuration History
export function getApiKeyConfigHistory(payload) {
    return action(GET_API_KEY_CONFIG_HISTORY, { payload })
}

// Redux action for Get Api Key Configuration History Success
export function getApiKeyConfigHistorySuccess(data) {
    return action(GET_API_KEY_CONFIG_HISTORY_SUCCESS, { data })
}

// Redux action for Get Api Key Configuration History Failure
export function getApiKeyConfigHistoryFailure() {
    return action(GET_API_KEY_CONFIG_HISTORY_FAILURE)
}

// Redux action for Clear Api Key Configuration History
export function clearApiKeyConfigHistory() {
    return action(CLEAR_API_KEY_CONFIG_HISTORY)
}