/**
 * Auther : Tejas Gauswami
 * Created : 03/06/2019
 * Arbitrage Reports Actions
 */

//Import action types form type.js
import {
    //Trade History Report
    ARBITRAGE_TRADE_HISTORY_REPORT,
    ARBITRAGE_TRADE_HISTORY_REPORT_SUCCESS,
    ARBITRAGE_TRADE_HISTORY_REPORT_FAILURE,

    //Open Order Report
    ARBITRAGE_OPEN_ORDER_REPORT,
    ARBITRAGE_OPEN_ORDER_REPORT_SUCCESS,
    ARBITRAGE_OPEN_ORDER_REPORT_FAILURE,

    //Active Order Report
    ARBITRAGE_ACTIVE_ORDER_REPORT,
    ARBITRAGE_ACTIVE_ORDER_REPORT_SUCCESS,
    ARBITRAGE_ACTIVE_ORDER_REPORT_FAILURE,

    //Recent Order Report
    ARBITRAGE_RECENT_ORDER_REPORT,
    ARBITRAGE_RECENT_ORDER_REPORT_SUCCESS,
    ARBITRAGE_RECENT_ORDER_REPORT_FAILURE,

    //Get Chart Data
    ARBITRAGE_CHART_DATA,
    ARBITRAGE_CHART_DATA_SUCCESS,
    ARBITRAGE_CHART_DATA_FAILURE,

    // cancel order
    DO_CANCEL_ORDER_ARBITRAGE,
    DO_CANCEL_ORDER_ARBITRAGE_SUCCESS,
    DO_CANCEL_ORDER_ARBITRAGE_FAILURE,


    //MArket Trade History By Tejas 12/6/2019    
    ARBITRAGE_MARKET_TRADE_HISTORY,
    ARBITRAGE_MARKET_TRADE_HISTORY_SUCCESS,
    ARBITRAGE_MARKET_TRADE_HISTORY_FAILURE
} from '../types';

/**
 * Redux Action To Trade History Report
 */
export const arbitrageTradeHistory = (data) => ({
    type: ARBITRAGE_TRADE_HISTORY_REPORT,
    payload: data
});

/**
 * Redux Action Trade History Report Success
 */
export const arbitrageTradeHistorySuccess = (list) => ({
    type: ARBITRAGE_TRADE_HISTORY_REPORT_SUCCESS,
    payload: list
});

/**
 * Redux Action Trade History Report Failure
 */
export const arbitrageTradeHistoryFailure = (error) => ({
    type: ARBITRAGE_TRADE_HISTORY_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Open Order Report
 */
export const arbitrageOpenOrder = (data) => ({
    type: ARBITRAGE_OPEN_ORDER_REPORT,
    payload: data
});

/**
 * Redux Action Open Order Report Success
 */
export const arbitrageOpenOrderSuccess = (list) => ({
    type: ARBITRAGE_OPEN_ORDER_REPORT_SUCCESS,
    payload: list
});

/**
 * Redux Action Open Order Report Failure
 */
export const arbitrageOpenOrderFailure = (error) => ({
    type: ARBITRAGE_OPEN_ORDER_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Active Order Report
 */
export const arbitrageActiveOrder = (data) => ({
    type: ARBITRAGE_ACTIVE_ORDER_REPORT,
    payload: data
});

/**
 * Redux Action Active Order Report Success
 */
export const arbitrageActiveOrderSuccess = (list) => ({
    type: ARBITRAGE_ACTIVE_ORDER_REPORT_SUCCESS,
    payload: list
});

/**
 * Redux Action Active Order Report Failure
 */
export const arbitrageActiveOrderFailure = (error) => ({
    type: ARBITRAGE_ACTIVE_ORDER_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Recent Order Report
 */
export const arbitrageRecentOrder = (data) => ({
    type: ARBITRAGE_RECENT_ORDER_REPORT,
    payload: data
});

/**
 * Redux Action Recent Order Report Success
 */
export const arbitrageRecentOrderSuccess = (list) => ({
    type: ARBITRAGE_RECENT_ORDER_REPORT_SUCCESS,
    payload: list
});

/**
 * Redux Action Recent Order Report Failure
 */
export const arbitrageRecentOrderFailure = (error) => ({
    type: ARBITRAGE_RECENT_ORDER_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Chart Data
 */
export const getArbitrageChartData = (data) => ({
    type: ARBITRAGE_CHART_DATA,
    payload: data
});

/**
 * Redux Action Get Chart Data Success
 */
export const getArbitrageChartDataSuccess = (list) => ({
    type: ARBITRAGE_CHART_DATA_SUCCESS,
    payload: list
});

/**
 * Redux Action Get Chart Data Failure
 */
export const getArbitrageChartDataFailure = (error) => ({
    type: ARBITRAGE_CHART_DATA_FAILURE,
    payload: error
});

/**  code by Jayshreeba gohil merge by Tejas START*/
//action for do Cancel Order and set type for reducers
export const doCancelOrderArbitrage = Order => ({
    type: DO_CANCEL_ORDER_ARBITRAGE,
    payload: { Order }
});

//action for set Success and data for do Cancel Order  and set type for reducers
export const doCancelOrderArbitrageSuccess = response => ({
    type: DO_CANCEL_ORDER_ARBITRAGE_SUCCESS,
    payload: response
});

//action for set failure and error to do Cancel Order  and set type for reducers
export const doCancelOrderArbitrageFailure = error => ({
    type: DO_CANCEL_ORDER_ARBITRAGE_FAILURE,
    payload: error
});

/**  code by Jayshreeba gohil merge by Tejas  END*/


// ADDED BY TEJAS FOR MARKET TRADE HISTORY 12/6/2019 START

/**
 * Redux Action To Market Trade History
 */
export const arbitrageMarketTradeHistory = (data) => ({
    type: ARBITRAGE_MARKET_TRADE_HISTORY,
    payload: data
});

/**
 * Redux Action Market Trade History Success
 */
export const arbitrageMarketTradeHistorySuccess = (list) => ({
    type: ARBITRAGE_MARKET_TRADE_HISTORY_SUCCESS,
    payload: list
});

/**
 * Redux Action Market Trade History Failure
 */
export const arbitrageMarketTradeHistoryFailure = (error) => ({
    type: ARBITRAGE_MARKET_TRADE_HISTORY_FAILURE,
    payload: error
});

// END