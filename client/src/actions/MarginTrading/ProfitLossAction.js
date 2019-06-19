/* 
    Developer : Vishva shah
    Date : 18-04-2019
    File Comment : Profit Loss report Action
*/
import {
    //list
    PROFIT_LOSS_LIST,
	PROFIT_LOSS_LIST_SUCCESS,
	PROFIT_LOSS_LIST_FAILURE,

} from '../types';

/* List maging wallets Ledger*/
export const getProgitLossList = (request) => ({
    type: PROFIT_LOSS_LIST,
    request: request
});
export const getProgitLossListSuccess = (response) => ({
    type: PROFIT_LOSS_LIST_SUCCESS,
    payload: response
});
export const getProgitLossListFailure = (error) => ({
    type: PROFIT_LOSS_LIST_FAILURE,
    payload: error
});