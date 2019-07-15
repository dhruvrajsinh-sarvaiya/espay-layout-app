import {
    // Fetch Open Order History
    FETCH_OPEN_ORDER_HISTORY,
    FETCH_OPEN_ORDER_SUCCESS,
    FETCH_OPEN_ORDER_FAILURE,

    // Cancel Open Order
    CANCEL_OPEN_ORDER,
    CANCEL_OPEN_ORDER_SUCCESS,
    CANCEL_OPEN_ORDER_FAILURE,

    // Clear Cancel Open Order
    CLEAR_CANCEL_OPEN_ORDER,

    // Clear Open Order
    CLEAR_OPEN_ORDER,
} from '../ActionTypes';
import { action } from '../GlobalActions';

// Redux action to Fetch Open Order
export function fetchOpenOrders(payload) {
    return action(FETCH_OPEN_ORDER_HISTORY, { payload });
}

// Redux action to Fetch Open Order Success
export function openOrderSuccess(data) {
    return action(FETCH_OPEN_ORDER_SUCCESS, { data });
}

// Redux action to Fetch Open Order Failure
export function openOrderFailure() {
    return action(FETCH_OPEN_ORDER_FAILURE);
}

// Redux action to Clear Open Order
export function clearOpenOrder() {
    return action(CLEAR_OPEN_ORDER);
}

// Redux action to Cancel Open Order
export function cancelOpenOrder(payload) {
    return action(CANCEL_OPEN_ORDER, { payload });
}
// Redux action to Cancel Open Order Success
export function cancelOpenOrderSuccess(data) {
    return action(CANCEL_OPEN_ORDER_SUCCESS, { data });
}
// Redux action to Cancel Open Order Failure
export function cancelOpenOrderFailure() {
    return action(CANCEL_OPEN_ORDER_FAILURE);
}

// Redux action to Clear Cancel Open Order
export function clearCancelOpenOrder() {
    return action(CLEAR_CANCEL_OPEN_ORDER);
}