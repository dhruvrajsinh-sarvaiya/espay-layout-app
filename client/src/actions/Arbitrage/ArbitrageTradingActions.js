/*
Name: Tejas Gauswami
Use : Actions for Arbitrage Trade Order   
Date  : 11/6/2019
*/


//Import action types form type.js
import {

    // types for Arbitrage Trade Order
    ARBITRAGE_TRADE_ORDER,
    ARBITRAGE_TRADE_ORDER_SUCCESS,
    ARBITRAGE_TRADE_ORDER_FAILURE,

    // types for List exchange smart arbitrage
    LIST_EXCHANGE_SMART_ARBITRAGE,
    LIST_EXCHANGE_SMART_ARBITRAGE_SUCCESS,
    LIST_EXCHANGE_SMART_ARBITRAGE_FAILURE,

} from 'Actions/types';

/**
 * Redux Action To Arbitrage Trade Order
 */
export const arbitrageTradeOrder = (data) => ({
    type: ARBITRAGE_TRADE_ORDER,
    payload: data
});

/**
 * Redux Action Arbitrage Trade Order Success
 */
export const arbitrageTradeOrderSuccess = (list) => ({
    type: ARBITRAGE_TRADE_ORDER_SUCCESS,
    payload: list
});

/**
 * Redux Action Arbitrage Trade Order Failure
 */
export const arbitrageTradeOrderFailure = (error) => ({
    type: ARBITRAGE_TRADE_ORDER_FAILURE,
    payload: error
});

/**
 * Redux Action To List Exchange Smart Arbitrage
 */
export const listExchangeSmartArbitrage = (data) => ({
    type: LIST_EXCHANGE_SMART_ARBITRAGE,
    payload: data
});

/**
 * Redux Action List Exchange Smart Arbitrage Success
 */
export const listExchangeSmartArbitrageSuccess = (list) => ({
    type: LIST_EXCHANGE_SMART_ARBITRAGE_SUCCESS,
    payload: list
});

/**
 * Redux Action List Exchange Smart Arbitrage Failure
 */
export const listExchangeSmartArbitrageFailure = (error) => ({
    type: LIST_EXCHANGE_SMART_ARBITRAGE_FAILURE,
    payload: error
});