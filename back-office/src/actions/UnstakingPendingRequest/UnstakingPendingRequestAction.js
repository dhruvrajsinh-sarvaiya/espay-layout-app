/*
Saga : Unstaking Pending Request 
Created By : Vishva shah
Date : 12/03/2019
*/

import {

    GET_LIST_PENDING_REQUEST,
    GET_LIST_PENDING_REQUEST_SUCCESS,
    GET_LIST_PENDING_REQUEST_FAILURE,

    ACCEPTREJECT_UNSTAKING_REQUEST,
    ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS,
    ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE

} from "../types";

// unstakig request list
export const getListPendingRequest = (request) => ({
    type: GET_LIST_PENDING_REQUEST,
    request: request
});

export const getListPendingRequestSuccess = response => ({
    type: GET_LIST_PENDING_REQUEST_SUCCESS,
    payload: response
});

export const getListPendingRequestFailure = error => ({
    type: GET_LIST_PENDING_REQUEST_FAILURE,
    payload: error
});

// Accept reject request
export const AccepetRejectRequest = (request) => ({
    type: ACCEPTREJECT_UNSTAKING_REQUEST,
    payload: request
});
export const AccepetRejectRequestSuccess = response => ({
    type: ACCEPTREJECT_UNSTAKING_REQUEST_SUCCESS,
    payload: response
});
export const AccepetRejectRequestFailure = error => ({
    type: ACCEPTREJECT_UNSTAKING_REQUEST_FAILURE,
    payload: error
});


