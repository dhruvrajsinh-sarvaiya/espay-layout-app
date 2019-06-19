/* 
    Developer : Parth Andhariya
    Date : 04-06-2019
    File Comment :  Withdrawal Approval Action
*/
import {
    // list 
   GET_LIST_WITHDRAWAL_REQUEST,
   GET_LIST_WITHDRAWAL_REQUEST_SUCCESS,
   GET_LIST_WITHDRAWAL_REQUEST_FAILURE,
    //Accpet/Reject
    GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST,
    GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_SUCCESS,
    GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_FAILURE,
 
} from "../types";
/* list Withdrawal Approval */
export const getListWithdrawalRequest = (request) => ({
    type: GET_LIST_WITHDRAWAL_REQUEST,
    request: request
});
export const getListWithdrawalRequestSuccess = (response) => ({
    type: GET_LIST_WITHDRAWAL_REQUEST_SUCCESS,
    payload: response
});
export const getListWithdrawalRequestFailure = (error) => ({
    type: GET_LIST_WITHDRAWAL_REQUEST_FAILURE,
    payload: error
});
/*  Accept Reject Action */
export const getAcceptRejectWithdrawalRequest = (request) => ({
    type: GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST,
    request: request
});
export const getAcceptRejectWithdrawalRequestSuccess = (response) => ({
    type: GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_SUCCESS,
    payload: response
});
export const getAcceptRejectWithdrawalRequestFailure = (error) => ({
    type: GET_ACCEPT_REJECT_WITHDRAWAL_REQUEST_FAILURE,
    payload: error
});
