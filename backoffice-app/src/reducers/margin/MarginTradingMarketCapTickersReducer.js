import {
    // Get Margin Market Cap Ticker
    GET_MARGIN_MARKET_CAP_TIKER,
    GET_MARGIN_MARKET_CAP_TIKER_SUCCESS,
    GET_MARGIN_MARKET_CAP_TIKER_FAILURE,

    // Update Margin Market Cap Ticker
    UPDATE_MARGIN_MARKET_CAP_TIKER,
    UPDATE_MARGIN_MARKET_CAP_TIKER_SUCCESS,
    UPDATE_MARGIN_MARKET_CAP_TIKER_FAILURE,

    // Clear Margin Market Cap Ticker
    CLEAR_MARGIN_MARKET_CAP_TIKER,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const INITIAL_STATE = {

    //Trading Market Tickers
    marketTickers: null,
    isLoadingMarketTickers: false,
    marketTickersError: false,

    //Trading Market Tickers
    updateMarketTickers: null,
    isUpdatingMarketTickers: false,
    updateMarketTickersError: false
}

export default function MarginTradingMarketCapTickersReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Clear Margin Market Cap Ticker
        case CLEAR_MARGIN_MARKET_CAP_TIKER: {
            return INITIAL_STATE;
        }

        // Handle Trading Market Ticker list method data
        case GET_MARGIN_MARKET_CAP_TIKER: {
            return Object.assign({}, state, {
                marketTickers: null,
                isLoadingMarketTickers: true,
                marketTickersError: false,
            })
        }
        // Set Trading Market Ticker list success data
        case GET_MARGIN_MARKET_CAP_TIKER_SUCCESS: {
            return Object.assign({}, state, {
                marketTickers: action.payload,
                isLoadingMarketTickers: false,
                marketTickersError: false
            })
        }
        // Set Trading Market Ticker list failure data
        case GET_MARGIN_MARKET_CAP_TIKER_FAILURE: {
            return Object.assign({}, state, {
                marketTickers: null,
                isLoadingMarketTickers: false,
                marketTickersError: true
            })
        }

        // Handle Update Margin Market Ticker method data
        case UPDATE_MARGIN_MARKET_CAP_TIKER: {
            return Object.assign({}, state, {
                updateMarketTickers: null,
                isUpdatingMarketTickers: true,
                updateMarketTickersError: false,
            })
        }
        // Set Update Margin Market Ticker success data
        case UPDATE_MARGIN_MARKET_CAP_TIKER_SUCCESS: {
            return Object.assign({}, state, {
                updateMarketTickers: action.payload,
                isUpdatingMarketTickers: false,
                updateMarketTickersError: false
            })
        }

        // Set Update Margin Market Ticker failure data
        case UPDATE_MARGIN_MARKET_CAP_TIKER_FAILURE: {
            return Object.assign({}, state, {
                updateMarketTickers: null,
                isUpdatingMarketTickers: false,
                updateMarketTickersError: true
            })
        }

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}