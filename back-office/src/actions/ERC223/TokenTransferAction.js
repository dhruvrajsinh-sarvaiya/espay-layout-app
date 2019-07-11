/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Token transfer action
*/
import {
    //TokenTransfer
    GET_TOKEN_TRANSFER,
    GET_TOKEN_TRANSFER_SUCCESS,
    GET_TOKEN_TRANSFER_FAILURE,
    //token transfer list
    GET_TOKEN_TRANSFER_LIST,
    GET_TOKEN_TRANSFER_LIST_SUCCESS,
    GET_TOKEN_TRANSFER_LIST_FAILURE,
 } from "../types";

 /* token transfer methods.. */
 export const getTokenTransfer = (request) => ({
     type: GET_TOKEN_TRANSFER,
     request: request
 });
 export const getTokenTransferSuccess = (response) => ({
     type: GET_TOKEN_TRANSFER_SUCCESS,
     payload: response
 });
 export const getTokenTransferFailure = (error) => ({
     type: GET_TOKEN_TRANSFER_FAILURE,
     payload: error
 });

  /* token transfer list methods.. */
  export const getTokenTransferlist = (request) => ({
    type: GET_TOKEN_TRANSFER_LIST,
    request: request
});
export const getTokenTransferlistSuccess = (response) => ({
    type: GET_TOKEN_TRANSFER_LIST_SUCCESS,
    payload: response
});
export const getTokenTransferlistFailure = (error) => ({
    type: GET_TOKEN_TRANSFER_LIST_FAILURE,
    payload: error
});