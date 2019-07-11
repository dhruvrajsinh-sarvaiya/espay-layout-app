/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : ERC223 Actions
*/
import {
    // increase token supply...
   INCREASE_TOKENSUPPLY,
   INCREASE_TOKENSUPPLY_SUCCESS,
   INCREASE_TOKENSUPPLY_FAILURE,
   //decrease token supply
   DECREASE_TOKENSUPPLY,
   DECREASE_TOKENSUPPLY_SUCCESS,
   DECREASE_TOKENSUPPLY_FAILURE,
   //setTransferFee
   SET_TRANSFER_FEE,
   SET_TRANSFER_FEE_SUCCESS,
   SET_TRANSFER_FEE_FAILURE,
   //TokenTransfer
   GET_TOKEN_TRANSFER,
   GET_TOKEN_TRANSFER_SUCCESS,
   GET_TOKEN_TRANSFER_FAILURE,
} from "../types";

/* Increase methods.. */
export const increaseTokenSupply = (request) => ({
    type: INCREASE_TOKENSUPPLY,
    request: request
});
export const increaseTokenSupplySuccess = (response) => ({
    type: INCREASE_TOKENSUPPLY_SUCCESS,
    payload: response
});
export const increaseTokenSupplyFailure = (error) => ({
    type: INCREASE_TOKENSUPPLY_FAILURE,
    payload: error
});

/* Decrease methods.. */
export const decreaseTokenSupply = (request) => ({
    type: DECREASE_TOKENSUPPLY,
    request: request
});
export const decreaseTokenSupplySuccess = (response) => ({
    type: DECREASE_TOKENSUPPLY_SUCCESS,
    payload: response
});
export const decreaseTokenSupplyFailure = (error) => ({
    type: DECREASE_TOKENSUPPLY_FAILURE,
    payload: error
});
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