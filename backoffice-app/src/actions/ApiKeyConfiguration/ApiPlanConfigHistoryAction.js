// ApiPlanConfigHistoryAction.js
import {
    // for  Api Plan Configuration History
    GET_API_PLAN_CONFIG_HISTORY,
    GET_API_PLAN_CONFIG_HISTORY_SUCCESS,
    GET_API_PLAN_CONFIG_HISTORY_FAILURE,

    // for clear Api Plan Configuration History
    CLEAR_API_PLAN_CONFIG_HISTORY
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action for Api Plan Configuration History
export function getApiPlanConfigurationHistory(payload = {}) {
    return action(GET_API_PLAN_CONFIG_HISTORY, { payload })
}

// Redux action for Api Plan Configuration History Success
export function getApiPlanConfigurationHistorySuccess(data) {
    return action(GET_API_PLAN_CONFIG_HISTORY_SUCCESS, { data })
}

// Redux action for Api Plan Configuration History failure
export function getApiPlanConfigurationHistoryFailure() {
    return action(GET_API_PLAN_CONFIG_HISTORY_FAILURE)
}

// Redux action for clear Api Plan Configuration History 
export function clearApiPlanConfigurationHistory() {
    return action(CLEAR_API_PLAN_CONFIG_HISTORY)
}