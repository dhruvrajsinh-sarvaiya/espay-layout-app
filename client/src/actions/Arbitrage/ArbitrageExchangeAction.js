/*
Name: Tejas Gauswami
Use : Actions for Exchange List  
Date  : 12/6/2019
*/


//Import action types form type.js
import {

    // types Exchange List
    ARBITRAGE_EXCHANGE_LIST,
    ARBITRAGE_EXCHANGE_LIST_SUCCESS,
    ARBITRAGE_EXCHANGE_LIST_FAILURE,

} from 'Actions/types';

/**
 * Redux Action To Exchange List
 */
export const arbitrageGetExchangeList = (data) => ({
    type: ARBITRAGE_EXCHANGE_LIST,
    payload: data
});

/**
 * Redux Action Exchange List Success
 */
export const arbitrageGetExchangeListSuccess = (list) => ({
    type: ARBITRAGE_EXCHANGE_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action Exchange List Failure
 */
export const arbitrageGetExchangeListFailure = (error) => ({
    type: ARBITRAGE_EXCHANGE_LIST_FAILURE,
    payload: error
});
