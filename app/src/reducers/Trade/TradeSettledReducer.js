// Action types for Trade Setteled
import {
    // Get Trade Settled Data
    GET_TRADE_SETTLED_DATA,
    GET_TRADE_SETTLED_DATA_SUCCESS,
    GET_TRADE_SETTLED_DATA_FAILURE,

    // Clear Trade Setteled Data
    CLEAR_TRADE_SETTLED_DATA,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

// Initial state for Trade Setteled
const INTIAL_STATE = {

    //Trade Settled History
    tradeSettledData: null,
    isLoading: false,
    error: false
}

export default function tradeSettledReducer(state, action) {

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
        case CLEAR_TRADE_SETTLED_DATA: {
            return INTIAL_STATE;
        }

        // Handle Trade Setteled method data
        case GET_TRADE_SETTLED_DATA: {
            return Object.assign({}, state, {
                tradeSettledData: null,
                isLoading: true,
                error: false,
            })
        }
        // Set Trade Setteled success data
        case GET_TRADE_SETTLED_DATA_SUCCESS: {
            return Object.assign({}, state, {
                tradeSettledData: action.payload,
                isLoading: false,
                error: false
            })
        }
        // Set Trade Setteled failure data
        case GET_TRADE_SETTLED_DATA_FAILURE: {
            return Object.assign({}, state, {
                tradeSettledData: null,
                isLoading: false,
                error: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}