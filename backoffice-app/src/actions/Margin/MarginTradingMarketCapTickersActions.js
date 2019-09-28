import { action } from '../GlobalActions';
import {
    // Get Margin Market Cap Ticker
    GET_MARGIN_MARKET_CAP_TIKER,
    GET_MARGIN_MARKET_CAP_TIKER_SUCCESS,
    GET_MARGIN_MARKET_TICKERS_FAILURE,

    // Update Margin Market Cap Ticker
    UPDATE_MARGIN_MARKET_CAP_TIKER,
    UPDATE_MARGIN_MARKET_CAP_TIKER_SUCCESS,
    UPDATE_MARGIN_MARKET_CAP_TIKER_FAILURE,

    // Clear Margin Market Cap Ticker
    CLEAR_MARGIN_MARKET_CAP_TIKER
} from "../ActionTypes";

// Redux action for Margin Market Cap Ticker
export function getMarginMarketCapTickers(payload) { return action(GET_MARGIN_MARKET_CAP_TIKER, { payload }); }

// Redux action for Margin Market Cap Ticker Success
export function getMarginMarketCapTickersSuccess(payload) { return action(GET_MARGIN_MARKET_CAP_TIKER_SUCCESS, { payload }); }

// Redux action for Margin Market Cap Ticker Failure
export function getMarginMarketCapTickersFailure() { return action(GET_MARGIN_MARKET_TICKERS_FAILURE); }

// Redux action for Update Margin Market Cap Ticker
export function updateMarginCapMarketTickers(payload) { return action(UPDATE_MARGIN_MARKET_CAP_TIKER, { payload }); }

// Redux action for Update Margin Market Cap Ticker Success
export function updateMarginCapMarketTickersSuccess(payload) { return action(UPDATE_MARGIN_MARKET_CAP_TIKER_SUCCESS, { payload }); }

// Redux action for Update Margin Market Cap Ticker Failure
export function updateMarginCapMarketTickersFailure() { return action(UPDATE_MARGIN_MARKET_CAP_TIKER_FAILURE); }

// Redux action for Clear Margin Market Cap Ticker Data
export function clearMarginCapMarketTickersData() { return action(CLEAR_MARGIN_MARKET_CAP_TIKER); }