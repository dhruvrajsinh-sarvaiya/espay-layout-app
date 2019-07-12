import {
    // Fetch Order History
    FETCH_ORDER_HISTORY,
    FETCH_ORDER_HISTORY_SUCCESS,
    FETCH_ORDER_HISTORY_FAILURE,

    // Clear Order History
    CLEAR_ORDER_HISTORY,
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action to Order History
export function onOrderHistory(payload) {
    return action(FETCH_ORDER_HISTORY, { payload })
}

// Redux action to Order History Success
export function onOrderHistorySuccess(data) {
    return action(FETCH_ORDER_HISTORY_SUCCESS, { data })
}

// Redux action to Order History Failure
export function onOrderHistoryFailure() {
    return action(FETCH_ORDER_HISTORY_FAILURE)
}

// Redux action to Clear Order History
export function clearOrderHistory() {
    return action(CLEAR_ORDER_HISTORY);
}