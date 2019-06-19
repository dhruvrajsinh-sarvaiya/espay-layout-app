/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Decrease token action
*/
import {
     //decrease token supply
   DECREASE_TOKENSUPPLY,
   DECREASE_TOKENSUPPLY_SUCCESS,
   DECREASE_TOKENSUPPLY_FAILURE,
   // decrease token list
   GET_DECREASE_TOKENSUPPLY_LIST,
   GET_DECREASE_TOKENSUPPLY_LIST_SUCCESS,
   GET_DECREASE_TOKENSUPPLY_LIST_FAILURE,
} from "../types";

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

/* Decrease list methods.. */
export const decreaseTokenSupplyList = (request) => ({
    type: GET_DECREASE_TOKENSUPPLY_LIST,
    request: request
});
export const decreaseTokenSupplyListSuccess = (response) => ({
    type: GET_DECREASE_TOKENSUPPLY_LIST_SUCCESS,
    payload: response
});
export const decreaseTokenSupplyListFailure = (error) => ({
    type: GET_DECREASE_TOKENSUPPLY_LIST_FAILURE,
    payload: error
});