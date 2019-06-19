// Actions For Market Trade History Action list By Tejas Date :14/9/2018

// import types 
import {
    GET_MARKET_TRADE_HISTORY,
    GET_MARKET_TRADE_HISTORY_SUCCESS,
    GET_MARKET_TRADE_HISTORY_FAILURE,
    CHANGE_MARKET_TRADE_HISTORY_SOCKET,
    CLOSE_SOCKET_CONNECTION
} from 'Actions/types';

//action for getMarket Trade History and set type for reducers
export const getMarketTradeHistory = (Pair) => ({
    type: GET_MARKET_TRADE_HISTORY,
    payload: Pair
});

//action for set Success and data to Market Trade History and set type for reducers
export const getMarketTradeHistorySuccess = (response) => ({
    type: GET_MARKET_TRADE_HISTORY_SUCCESS,
    payload: response.response
});

//action for set failure and error to Market Trade History and set type for reducers
export const getMarketTradeHistoryFailure = (error) => ({
    type: GET_MARKET_TRADE_HISTORY_FAILURE,
    payload: error
});

// action for change socket connection when pair change
export const changeMarketTradeSocketConnection = (changeMarketTradeSocketRequest) => ({
    type: CHANGE_MARKET_TRADE_HISTORY_SOCKET,
    payload: changeMarketTradeSocketRequest
});

// action for close socket connection
export const closeMarketHistorySocketConnection = (closeConnectionRequest) => ({
    type: CLOSE_SOCKET_CONNECTION,
    payload: closeConnectionRequest
});