import {
    // Get Api Plan Subscription History
    GET_API_PLAN_SUBSCRIPTION_HISTORY,
    GET_API_PLAN_SUBSCRIPTION_HISTORY_SUCCESS,
    GET_API_PLAN_SUBSCRIPTION_HISTORY_FAILURE,

    // Clear Api Plan Subscription History
    CLEAR_API_PLAN_SUBSCRIPTION_HISTORY
} from "../ActionTypes";
import { action } from "../GlobalActions";

// Redux action for Get Api Plan Subscription History
export function getApiPlanSubHistory(payload) {
    return action(GET_API_PLAN_SUBSCRIPTION_HISTORY, { payload })
}

// Redux action for Get Api Plan Subscription History Success
export function getApiPlanSubHistorySuccess(data) {
    return action(GET_API_PLAN_SUBSCRIPTION_HISTORY_SUCCESS, { data })
}

// Redux action for Get Api Plan Subscription History Failure
export function getApiPlanSubHistoryFailure() {
    return action(GET_API_PLAN_SUBSCRIPTION_HISTORY_FAILURE)
}

// Redux action for Clear Api Plan Subscription History
export function clearApiPlanSubHistory() {
    return action(CLEAR_API_PLAN_SUBSCRIPTION_HISTORY)
}