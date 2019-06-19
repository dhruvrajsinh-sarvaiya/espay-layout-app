/* 
    Developer : Parth Andhariya
    Date : 10-06-2019
    File Comment : Topup History action
*/
import {
    // list 
    LIST_TOPUP_HISTORY,
    LIST_TOPUP_HISTORY_SUCCESS,
    LIST_TOPUP_HISTORY_FAILURE,
    //  Add....
    ADD_TOPUP_REQUEST,
    ADD_TOPUP_REQUEST_SUCCESS,
    ADD_TOPUP_REQUEST_FAILURE,
} from "Actions/types";

/* list Topup History */
export const ListTopupHistory = (request) => ({
    type: LIST_TOPUP_HISTORY,
    request: request
});
export const ListTopupHistorySuccess = (response) => ({
    type: LIST_TOPUP_HISTORY_SUCCESS,
    payload: response
});
export const ListTopupHistoryFailure = (error) => ({
    type: LIST_TOPUP_HISTORY_FAILURE,
    payload: error
});
/* Add Topup Request */
export const AddTopupRequest = (request) => ({
    type: ADD_TOPUP_REQUEST,
    request: request
});
export const AddTopupRequestSuccess = (response) => ({
    type: ADD_TOPUP_REQUEST_SUCCESS,
    payload: response
});
export const AddTopupRequestFailure = (error) => ({
    type: ADD_TOPUP_REQUEST_FAILURE,
    payload: error
});
