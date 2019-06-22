// Action types for Market Cap Module
import {
    // Fetch Market Cap
    FETCH_MARKET_CAP,
    FETCH_MARKET_CAP_SUCCESS,
    FETCH_MARKET_CAP_FAILURE,

    // Action Logout
    ACTION_LOGOUT,
} from '../../actions/ActionTypes';

// Initial state for Market Cap Module
const INTIAL_STATE = {

    // Market Cap
    marketCap: null,
    isFetchingMarketCap: false,
    errorMarketCap: false,
}

export default function marketCapReducer(state = INTIAL_STATE, action) {
    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Market Cap method data
        case FETCH_MARKET_CAP:
            return {
                ...state,
                marketCap: null,
                isFetchingMarketCap: true,
                errorMarketCap: false
            }
        // Set Market Cap success data
        case FETCH_MARKET_CAP_SUCCESS:
            return {
                ...state,
                marketCap: action.data,
                isFetchingMarketCap: false,
                errorMarketCap: false
            }
        // Set Market Cap failure data
        case FETCH_MARKET_CAP_FAILURE:
            return {
                ...state,
                marketCap: null,
                isFetchingMarketCap: false,
                errorMarketCap: true
            }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}