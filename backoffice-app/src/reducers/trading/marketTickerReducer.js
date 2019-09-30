import {
    //Trading Market Tickers
    GET_MARKET_TICKERS,
    GET_MARKET_TICKERS_SUCCESS,
    GET_MARKET_TICKERS_FAILURE,

    //Trading Market Tickers update
    UPDATE_MARKET_TICKER,
    UPDATE_MARKET_TICKER_SUCCESS,
    UPDATE_MARKET_TICKER_FAILURE,

    //clear data
    CLEAR_MARKET_TICKER_DATA,
    ACTION_LOGOUT
} from '../../actions/ActionTypes';

const initialState = {

    //Trading Market Tickers
    marketTickers: null,
    isLoadingMarketTickers: false,
    marketTickersError: false,

    //Trading Market Tickers update
    updateMarketTickers: null,
    isUpdatingMarketTickers: false,
    updateMarketTickersError: false
}

export default function marketTickerReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case CLEAR_MARKET_TICKER_DATA:
            return initialState

        //Handle Trading Market Ticker list
        case GET_MARKET_TICKERS: {
            return Object.assign({}, state, {
                marketTickers: null,
                isLoadingMarketTickers: true,
                marketTickersError: false,
            })
        }
        //Set Trading Market Ticker list success
        case GET_MARKET_TICKERS_SUCCESS: {
            return Object.assign({}, state, {
                marketTickers: action.payload,
                isLoadingMarketTickers: false,
                marketTickersError: false
            })
        }
        //Set Trading Market Ticker list failure
        case GET_MARKET_TICKERS_FAILURE: {
            return Object.assign({}, state, {
                marketTickers: null,
                isLoadingMarketTickers: false,
                marketTickersError: true
            })
        }

        //Handle Update Trading Market Ticker list
        case UPDATE_MARKET_TICKER: {
            return Object.assign({}, state, {
                updateMarketTickers: null,
                isUpdatingMarketTickers: true,
                updateMarketTickersError: false,
            })
        }
        //Set Update Trading Market Ticker list success
        case UPDATE_MARKET_TICKER_SUCCESS: {
            return Object.assign({}, state, {
                updateMarketTickers: action.payload,
                isUpdatingMarketTickers: false,
                updateMarketTickersError: false
            })
        }
        //Set Update Trading Market Ticker list failure
        case UPDATE_MARKET_TICKER_FAILURE: {
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