/*
* Organization ledger Action File
* Added By Jinesh Bhatt
* Date : 07-01-2019*/

import {
    GET_EMAIL_QUEUE_REQUEST,
    GET_EMAIL_QUEUE_SUCCESS,
    GET_EMAIL_QUEUE_FAIL,
    RESEND_EMAIL_QUEUE_REQUEST,
    RESEND_EMAIL_QUEUE_REQUEST_SUCCESS,
    RESEND_EMAIL_QUEUE_REQUEST_FAIL
} from 'Actions/types';


// redux action for get Organization Ledger Report
export const displayEmailQueueList = QueueRequest => ({
    type: GET_EMAIL_QUEUE_REQUEST,
    payload: QueueRequest
});

// redux action for get Organization Ledger Report successfull
export const displayEmailQueueListSuccess = response => ({
    type: GET_EMAIL_QUEUE_SUCCESS,
    payload: response
});

// redux action for get Organization Ledger Report with some error
export const displayEmailQueueListFail = error => ({
    type: GET_EMAIL_QUEUE_FAIL,
    payload: error
});

export const resentEmailRequest = request => ({
    type:RESEND_EMAIL_QUEUE_REQUEST,
    payload:request
});

export const resentEmailRequestSuccess = response => ({
    type:RESEND_EMAIL_QUEUE_REQUEST_SUCCESS,
    payload:response
});

export const resentEmailRequestFail = error => ({
    type:RESEND_EMAIL_QUEUE_REQUEST_FAIL,
    payload:error
});