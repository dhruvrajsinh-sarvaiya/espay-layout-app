/* 
    Developer : Vishva shah
    Date : 07-06-2019
    File Comment : Arbitrage Exchange balance Actions
*/
import {
    // list...
   GET_EXCHANGEBALANCE_LIST,
   GET_EXCHANGEBALANCE_LIST_SUCCESS,
   GET_EXCHANGEBALANCE_LIST_FAILURE,
} from "Actions/types";

/* List methods.. */
export const getExchangeBalanceList = (request) => ({
    type: GET_EXCHANGEBALANCE_LIST,
    request: request
});
export const getExchangeBalanceListSuccess = (response) => ({
    type: GET_EXCHANGEBALANCE_LIST_SUCCESS,
    payload: response
});
export const getExchangeBalanceListFailure = (error) => ({
    type: GET_EXCHANGEBALANCE_LIST_FAILURE,
    payload: error
});