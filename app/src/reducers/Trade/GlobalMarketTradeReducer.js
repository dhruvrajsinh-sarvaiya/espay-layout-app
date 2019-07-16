// Action types for Market Trade List
import {
    // Fetch Market Trade List
    FETCH_MARKET_TRADE_LIST,
    FETCH_MARKET_TRADE_LIST_SUCCESS,
    FETCH_MARKET_TRADE_LIST_FAILURE,

    // Action Logout
    ACTION_LOGOUT,

    // Clear Market Trade List
    CLEAR_MARKET_TRADE_LIST,
} from '../../actions/ActionTypes';

// Initial state for Market Trade List
const INTIAL_STATE = {
    // Market Trades List
    markettradedata: null,
    isFetchingMarketTrade: false,
    errorMarketTrade: false,
}

export default function globalMarketTradeReducer(state, action) {

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
        case CLEAR_MARKET_TRADE_LIST: {
            return INTIAL_STATE;
        }

        // Handle Market Trade List method data
        case FETCH_MARKET_TRADE_LIST:
            return {
                ...state,
                markettradedata: null,
                isFetchingMarketTrade: true
            }
        // Set Market Trade List success data
        case FETCH_MARKET_TRADE_LIST_SUCCESS:
            return {
                ...state,
                markettradedata: action.data,
                isFetchingMarketTrade: false
            }
        // Set Market Trade List failure data
        case FETCH_MARKET_TRADE_LIST_FAILURE:
            return {
                ...state,
                markettradedata: null,
                isFetchingMarketTrade: false,
                errorMarketTrade: true
            }

        // If no actions were found from reducer then return default [existing] state value
        default:
            return state;
    }
}