// import from types
import {
    GET_DEPOSIT_HISTORY,
    GET_DEPOSIT_HISTORY_SUCCESS,
    GET_DEPOSIT_HISTORY_FAILURE,
} from '../types';

/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    Comment : Function for dispatch Get Deposit History Action
*/
export const getDepositHistory = (request) => ({
    type: GET_DEPOSIT_HISTORY,
    request : request
});

/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    Comment : Function for dispatch Get Deposit History Success Action
*/
export const getDepositHistorySuccess = (response) => ({
    type: GET_DEPOSIT_HISTORY_SUCCESS,    
    payload: response
})

/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    Comment : Function for dispatch Get Deposit History Failure Action
*/
export const getDepositHistoryFailure = (error) => ({
    type: GET_DEPOSIT_HISTORY_FAILURE,
    payload: error
})

