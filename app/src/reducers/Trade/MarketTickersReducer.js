// Action types for Market Tickers
import {
    // Get Market Ticker
    GET_MARKET_TICKER,
    GET_MARKET_TICKER_SUCCESS,
    GET_MARKET_TICKER_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

// Initial State for Market Tickers
const INTIAL_STATE = {

    //to get market ticker list
    marketTickers: null,
    isLoadingMarketTicker: false,
    marketTickerError: false,
}

export default function MarketTickersReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Market Ticker method data
        case GET_MARKET_TICKER: {
            return Object.assign({}, state, {
                marketTickers: null,
                isLoadingMarketTicker: true,
                marketTickerError: false
            })
        }
        // Set Market Ticker success data
        case GET_MARKET_TICKER_SUCCESS: {
            return Object.assign({}, state, {
                marketTickers: action.payload,
                isLoadingMarketTicker: false,
                marketTickerError: false
            })
        }
        // Set Market Ticker failure data
        case GET_MARKET_TICKER_FAILURE: {
            return Object.assign({}, state, {
                marketTickers: null,
                isLoadingMarketTicker: false,
                marketTickerError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}