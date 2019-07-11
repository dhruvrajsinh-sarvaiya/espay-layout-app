/*
Name: Devang Parekh
Use : Actions for profit indicator   
Date  : 7/6/2019
*/

//Import action types form type.js
import {

    // types for profit indicator
    GET_ARBITRAGE_PROFITINDICATOR,
    GET_ARBITRAGE_PROFITINDICATOR_SUCCESS,
    GET_ARBITRAGE_PROFITINDICATOR_FAILURE,

} from 'Actions/types';

/**
 * Redux Action To profit indicator
 */
export const getAribitrageProfitIndicator = (data) => ({
    type: GET_ARBITRAGE_PROFITINDICATOR,
    payload: data
});

/**
 * Redux Action profit indicator Success
 */
export const getAribitrageProfitIndicatorSuccess = (list) => ({
    type: GET_ARBITRAGE_PROFITINDICATOR_SUCCESS,
    payload: list
});

/**
 * Redux Action profit indicator Failure
 */
export const getAribitrageProfitIndicatorFailure = (error) => ({
    type: GET_ARBITRAGE_PROFITINDICATOR_FAILURE,
    payload: error
});