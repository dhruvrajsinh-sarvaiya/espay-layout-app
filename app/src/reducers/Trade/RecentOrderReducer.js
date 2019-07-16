// Action types for Recent Order
import {
    // Fetch Recent Order
    FETCH_RECENT_ORDER,
    FETCH_RECENT_ORDER_SUCCESS,
    FETCH_RECENT_ORDER_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Recent Order
    CLEAR_RECENT_ORDER,
} from '../../actions/ActionTypes';

// Initial State for Recent Order
const INTIAL_STATE = {
    /* Recent (My Order) Order */
    recentorderdata: null,
    isFetchingRecentOrder: false,
    errorRecentOrder: false,
}

export default function recentOrderReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear method
        case CLEAR_RECENT_ORDER: {
            return INTIAL_STATE;
        }

        // Handle Recent Order method data
        case FETCH_RECENT_ORDER:
            return {
                ...state,
                recentorderdata: null,
                isFetchingRecentOrder: true
            }
        // Set Recent Order success data
        case FETCH_RECENT_ORDER_SUCCESS:
            return {
                ...state,
                recentorderdata: action.data,
                isFetchingRecentOrder: false
            }
        // Set Recent Order failure data
        case FETCH_RECENT_ORDER_FAILURE:
            return {
                ...state,
                recentorderdata: null,
                isFetchingRecentOrder: false,
                errorRecentOrder: true
            }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}