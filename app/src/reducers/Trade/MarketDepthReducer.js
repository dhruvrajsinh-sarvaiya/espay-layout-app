// Action types for Market Depth Chart
import {
    // Market Depth Data
    GET_MARKET_DEPTH_DATA,
    GET_MARKET_DEPTH_DATA_SUCCESS,
    GET_MARKET_DEPTH_DATA_FAILURE,

    // Clear Market Depth Data
    CLEAR_MARKET_DEPTH_DATA,
} from '../../actions/ActionTypes';
import { ACTION_LOGOUT } from '../../actions/ActionTypes';

// Initial state for Market Depth Chart
const INTIAL_STATE = {

    // Market Depth Chart Data
    marketDepth: null,
    isLoading: false,
    error: false
}

export default function marketDepthReducer(state = INTIAL_STATE, action) {

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // To reset initial state on clear method
        case CLEAR_MARKET_DEPTH_DATA: {
            return INTIAL_STATE;
        }

        // Handle Market Depth Chart Detail method data
        case GET_MARKET_DEPTH_DATA: {
            return Object.assign({}, state, {
                marketDepth: null,
                isLoading: true,
                error: false,
            })
        }
        // Set Market Depth Chart Detail success data
        case GET_MARKET_DEPTH_DATA_SUCCESS: {
            return Object.assign({}, state, {
                marketDepth: action.payload,
                isLoading: false,
                error: false
            })
        }
        // Set Market Depth Chart Detail failure data
        case GET_MARKET_DEPTH_DATA_FAILURE: {
            return Object.assign({}, state, {
                marketDepth: null,
                isLoading: false,
                error: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}