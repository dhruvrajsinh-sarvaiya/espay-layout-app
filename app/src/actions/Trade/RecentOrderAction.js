import {
    FETCH_RECENT_ORDER,
    FETCH_RECENT_ORDER_SUCCESS,
    FETCH_RECENT_ORDER_FAILURE,
    CLEAR_RECENT_ORDER,
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action to Fetch Recent Order
export function fetchRecentOrder(payload) {
    return action(FETCH_RECENT_ORDER, { payload });
}

// Redux action to Fetch Recent Order Success
export function recentOrderSuccess(data) {
    return action(FETCH_RECENT_ORDER_SUCCESS, { data });
}

// Redux action to Fetch Recent Order Failure
export function recentOrderFailure() {
    return action(FETCH_RECENT_ORDER_FAILURE);
}

// Redux action to Clear Recent Order
export function clearRecentOrder() {
    return action(CLEAR_RECENT_ORDER);
}