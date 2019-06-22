// Action types for Order History
import {
    // Fetch Order History
    FETCH_ORDER_HISTORY,
    FETCH_ORDER_HISTORY_SUCCESS,
    FETCH_ORDER_HISTORY_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Order History
    CLEAR_ORDER_HISTORY,
} from '../../actions/ActionTypes';

// Initial State for Order History
const INTIAL_STATE = {
    // Order History
    orderhistorydata: null,
    isFetchingOrderHistory: false,
    errorOrderHistory: false,
}

export default function orderHistoryReducer(state = INTIAL_STATE, action) {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear method
        case CLEAR_ORDER_HISTORY: {
            return INTIAL_STATE;
        }

        // Handle Order History method data
        case FETCH_ORDER_HISTORY:
            return {
                ...state,
                orderhistorydata: null,
                isFetchingOrderHistory: true
            }
        // Set Order History success data
        case FETCH_ORDER_HISTORY_SUCCESS:
            return {
                ...state,
                orderhistorydata: action.data,
                isFetchingOrderHistory: false
            }
        // Set Order History failure data
        case FETCH_ORDER_HISTORY_FAILURE:
            return {
                ...state,
                orderhistorydata: null,
                isFetchingOrderHistory: false,
                errorOrderHistory: true
            }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}