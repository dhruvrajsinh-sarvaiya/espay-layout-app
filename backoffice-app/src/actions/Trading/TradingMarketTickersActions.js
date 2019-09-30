import { action } from '../GlobalActions';
import {
    //market tickers list
    GET_MARKET_TICKERS,
    GET_MARKET_TICKERS_SUCCESS,
    GET_MARKET_TICKERS_FAILURE,

    //update market tickers 
    UPDATE_MARKET_TICKER,
    UPDATE_MARKET_TICKER_SUCCESS,
    UPDATE_MARKET_TICKER_FAILURE,

    //clear data
    CLEAR_MARKET_TICKER_DATA
} from "../ActionTypes";

//Redux action for get market tickers list
export function getMarketTickersBO(payload) { return action(GET_MARKET_TICKERS, { payload }); }
//Redux action for get market tickers list success
export function getMarketTickersBOSuccess(payload) { return action(GET_MARKET_TICKERS_SUCCESS, { payload }); }
//Redux action for get market tickers list failure
export function getMarketTickersBOFailure() { return action(GET_MARKET_TICKERS_FAILURE); }

//Redux action for update market tickers list
export function updateMarketTickersBO(payload) { return action(UPDATE_MARKET_TICKER, { payload }); }
//Redux action for update market tickers list success
export function updateMarketTickersBOSuccess(payload) { return action(UPDATE_MARKET_TICKER_SUCCESS, { payload }); }
//Redux action for update market tickers list failure
export function updateMarketTickersBOFailure() { return action(UPDATE_MARKET_TICKER_FAILURE); }

//clear datas
export function clearMarketTickersBOData() { return action(CLEAR_MARKET_TICKER_DATA); }