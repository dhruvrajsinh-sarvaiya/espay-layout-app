import {
    // Get Market Ticker 
    GET_MARKET_TICKER,
    GET_MARKET_TICKER_FAILURE,
    GET_MARKET_TICKER_SUCCESS,
} from '../ActionTypes';

import { action } from '../GlobalActions';

// Redux action to get market ticker list
export function getMarketTickerList() { return action(GET_MARKET_TICKER); }

// Redux action to get market ticker list Success
export function getMarketTickerListSuccess(payload) { return action(GET_MARKET_TICKER_SUCCESS, { payload }); }

// Redux action to get market ticker list Failure
export function getMarketTickerListFailure(error) { return action(GET_MARKET_TICKER_FAILURE, { error }); }