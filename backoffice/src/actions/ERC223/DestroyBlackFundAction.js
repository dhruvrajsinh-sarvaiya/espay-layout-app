/* 
    Developer : Vishva shah
    Date : 03-06-2019
    File Comment : Destroy Black fund token action
*/
import {
   //Destroy black fund list
   GET_DESTROYBLACKFUND_LIST,
   GET_DESTROYBLACKFUND_LIST_SUCCESS,
   GET_DESTROYBLACKFUND_LIST_FAILURE,
} from "../types";

/* Increase list methods.. */
export const destroyBlackFundList = (request) => ({
    type: GET_DESTROYBLACKFUND_LIST,
    request: request
});
export const destroyBlackFundListSuccess = (response) => ({
    type: GET_DESTROYBLACKFUND_LIST_SUCCESS,
    payload: response
});
export const destroyBlackFundListFailure = (error) => ({
    type: GET_DESTROYBLACKFUND_LIST_FAILURE,
    payload: error
});