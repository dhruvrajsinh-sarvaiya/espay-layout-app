/* 
    Developer : Vishva shah
    Date : 04-06-2019
    File Comment : Arbitrage report Action
*/
import {
    //ledger list
    GET_ARBITRAGELEDGER_LIST,
    GET_ARBITRAGELEDGER_LIST_SUCCESS,
    GET_ARBITRAGELEDGER_LIST_FAILURE,

} from '../types';

/* List arbitrage Ledger report*/
export const getArbitrageLedgerList = (request) => ({
    type: GET_ARBITRAGELEDGER_LIST,
    request: request
});
export const getArbitrageLedgerListSuccess = (response) => ({
    type: GET_ARBITRAGELEDGER_LIST_SUCCESS,
    payload: response
});
export const getArbitrageLedgerListFailure = (error) => ({
    type: GET_ARBITRAGELEDGER_LIST_FAILURE,
    payload: error
});