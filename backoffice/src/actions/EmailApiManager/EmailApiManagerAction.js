/*
* Email Api Manager Configuration Action File
* Added By Jinesh Bhatt
* Date : 09-01-2019*/

import {
    GET_EMAIL_API_LIST_REQUEST,
    GET_EMAIL_API_LIST_REQUEST_SUCCESS,
    GET_EMAIL_API_LIST_REQUEST_FAIL,
    EDIT_EMAIL_API_REQUEST,
    EDIT_EMAIL_API_REQUEST_SUCCESS,
    EDIT_EMAIL_API_REQUEST_FAIL,
    ADD_EMAIL_API_REQUEST,
    ADD_EMAIL_API_REQUEST_SUCCESS,
    ADD_EMAIL_API_REQUEST_FAIL,
    GET_REQUEST_FORMAT,
    GET_REQUEST_FORMAT_SUCCESS,
    GET_REQUEST_FORMAT_FAIL,
    GET_ALL_THIRD_PARTY_RESPONSE,
    GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS,
    GET_ALL_THIRD_PARTY_RESPONSE_FAIL
} from 'Actions/types';


// redux action for get Organization Ledger Report
export const getEmailApiList = request => ({
    type: GET_EMAIL_API_LIST_REQUEST,
    payload: request
});

// redux action for get Organization Ledger Report successfull
export const getEmailApiListSuccess = response => ({
    type: GET_EMAIL_API_LIST_REQUEST_SUCCESS,
    payload: response
});

// redux action for get Organization Ledger Report with some error
export const getEmailApiListFail = error => ({
    type: GET_EMAIL_API_LIST_REQUEST_FAIL,
    payload: error
});

export const editEmailApiRequest = EmailApiRequest => ({
    type: EDIT_EMAIL_API_REQUEST,
    payload: EmailApiRequest
});

export const editEmailApiRequestSuccess = response => ({
    type:EDIT_EMAIL_API_REQUEST_SUCCESS,
    payload:response
});

export const editEmailApiRequestFail = error => ({
    type:EDIT_EMAIL_API_REQUEST_FAIL,
    payload:error
});

export const addEmailApiRequest = EmailApiRequest => ({
    type: ADD_EMAIL_API_REQUEST,
    payload: EmailApiRequest
});

export const addEmailApiRequestSuccess = response => ({
    type:ADD_EMAIL_API_REQUEST_SUCCESS,
    payload:response
});

export const addEmailApiRequestFail = error => ({
    type:ADD_EMAIL_API_REQUEST_FAIL,
    payload:error
});

export const getAllRequestFormat = payload => ({
    type:GET_REQUEST_FORMAT,
    payload:payload
});

export const getAllRequestFormatSuccess = response => ({
    type:GET_REQUEST_FORMAT_SUCCESS,
    payload:response
});

export const getAllRequestFormatFail = error => ({
    type:GET_REQUEST_FORMAT_FAIL,
    payload:error
});

export const getAllThirdPartyAPIRespose = payload =>({
    type:GET_ALL_THIRD_PARTY_RESPONSE,
    payload:payload
});

export const getAllThirdPartyAPIResposeSuccess = response =>({
    type:GET_ALL_THIRD_PARTY_RESPONSE_SUCCESS,
    payload:response
});

export const getAllThirdPartyAPIResposeFail = error =>({
    type:GET_ALL_THIRD_PARTY_RESPONSE_FAIL,
    payload:error
});