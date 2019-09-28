import {
    //top history list 
    LIST_TOPUP_HISTORY,
    LIST_TOPUP_HISTORY_SUCCESS,
    LIST_TOPUP_HISTORY_FAILURE,

    //add Topup Request 
    ADD_TOPUP_REQUEST,
    ADD_TOPUP_REQUEST_SUCCESS,
    ADD_TOPUP_REQUEST_FAILURE,

    //clear data
    CLEAR_TOPUP_REQUEST_DATA
} from "../ActionTypes";

//get top history list 
export const ListTopupHistory = (request) => ({
    type: LIST_TOPUP_HISTORY,
    payload: request
});
//get top history list success
export const ListTopupHistorySuccess = (response) => ({
    type: LIST_TOPUP_HISTORY_SUCCESS,
    payload: response
});
//get top history list Faillure
export const ListTopupHistoryFailure = (error) => ({
    type: LIST_TOPUP_HISTORY_FAILURE,
    payload: error
});

//get Add Topup Request 
export const AddTopupRequest = (request) => ({
    type: ADD_TOPUP_REQUEST,
    payload: request
});
//get Add Topup Request Success
export const AddTopupRequestSuccess = (response) => ({
    type: ADD_TOPUP_REQUEST_SUCCESS,
    payload: response
});
//get Add Topup Request Failure
export const AddTopupRequestFailure = (error) => ({
    type: ADD_TOPUP_REQUEST_FAILURE,
    payload: error
});

//Redux action  for clear response
export const clearTopupHistoryData = () => ({
    type: CLEAR_TOPUP_REQUEST_DATA,
});

