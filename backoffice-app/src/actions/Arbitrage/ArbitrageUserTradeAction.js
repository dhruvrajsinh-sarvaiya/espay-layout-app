import {

    GET_ARBITRAGE_USER_TRADE_COUNT,
    GET_ARBITRAGE_USER_TRADE_COUNT_SUCCESS,
    GET_ARBITRAGE_USER_TRADE_COUNT_FAILURE,

    GET_USER_MARKET_COUNT,
    GET_USER_MARKET_COUNT_SUCCESS,
    GET_USER_MARKET_COUNT_FAILURE,

} from "../ActionTypes";

//action for Get Arbitrage Total Count List and set type for reducers
export const getArbitrageUserTradeCount = (request) => ({
    type: GET_ARBITRAGE_USER_TRADE_COUNT,
    payload: request
});

//action for set Success and Get Arbitrage Total Count List and set type for reducers
export const getArbitrageUserTradeCountSuccess = (response) => ({
    type: GET_ARBITRAGE_USER_TRADE_COUNT_SUCCESS,
    payload: response
});

//action for set failure and error to Get Arbitrage Total Count List and set type for reducers
export const getArbitrageUserTradeCountFailure = (error) => ({
    type: GET_ARBITRAGE_USER_TRADE_COUNT_FAILURE,
    payload: error
});

//action for Get Total Count List and set type for reducers
export const getUserMarketCount = (request) => ({
    type: GET_USER_MARKET_COUNT,
    payload: request
});

//action for set Success and Get Total Count List and set type for reducers
export const getUserMarketCountSuccess = (response) => ({
    type: GET_USER_MARKET_COUNT_SUCCESS,
    payload: response
});

//action for set failure and error to Get Total Count List and set type for reducers
export const getUserMarketCountFailure = (error) => ({
    type: GET_USER_MARKET_COUNT_FAILURE,
    payload: error
});