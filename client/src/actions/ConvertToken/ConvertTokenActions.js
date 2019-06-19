/* 
    Developer : Nishant Vadgama,
    Date : 24-09-2018
    FIle Comment : convert token action methods
*/
import {
  GET_CTINFO,
  GET_CTINFO_SUCCESS,
  GET_CTINFO_FAILURE,
  SUBMIT_CTREQUEST,
  SUBMIT_CTREQUEST_SUCCESS,
  SUBMIT_CTREQUEST_FAILURE
} from "../types";

export const getConvertTokenInfo = () => ({
  type: GET_CTINFO
});

export const getConvertTokenInfoSuccess = payload => ({
  type: GET_CTINFO_SUCCESS,
  payload: payload.data
});

export const getConvertTokenInfoFailure = error => ({
  type: GET_CTINFO_FAILURE,
  error: error
});

export const submitConvertTokenRequest = payload => ({
  type: SUBMIT_CTREQUEST,
  payload: payload
});

export const submitConvertTokenRequestSuccess = payload => ({
  type: SUBMIT_CTREQUEST_SUCCESS,
  payload: payload
});

export const submitConvertTokenRequestFailure = error => ({
  type: SUBMIT_CTREQUEST_FAILURE,
  error: error
});
