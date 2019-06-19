/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Set transfer fee action
*/
import {
    //setTransferFee
    SET_TRANSFER_FEE,
    SET_TRANSFER_FEE_SUCCESS,
    SET_TRANSFER_FEE_FAILURE,
    //set transfer fee list
    GET_SET_TRANSFER_FEE,
    GET_SET_TRANSFER_FEE_LIST_SUCCESS,
    GET_SET_TRANSFER_FEE_LIST_FAILURE,
} from "../types";

/* set transfer fee methods.. */
export const setTransferFee = (request) => ({
    type: SET_TRANSFER_FEE,
    request: request
});
export const setTransferFeeSuccess = (response) => ({
    type: SET_TRANSFER_FEE_SUCCESS,
    payload: response
});
export const setTransferFeeFailure = (error) => ({
    type: SET_TRANSFER_FEE_FAILURE,
    payload: error
});

/* set transfer fee list methods.. */
export const setTransferFeeList = (request) => ({
    type: GET_SET_TRANSFER_FEE,
    request: request
});
export const setTransferFeeListSuccess = (response) => ({
    type: GET_SET_TRANSFER_FEE_LIST_SUCCESS,
    payload: response
});
export const setTransferFeeListFailure = (error) => ({
    type: GET_SET_TRANSFER_FEE_LIST_FAILURE,
    payload: error
});