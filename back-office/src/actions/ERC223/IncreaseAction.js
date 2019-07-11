/* 
    Developer : Vishva shah
    Date : 27-05-2019
    File Comment : Increase token action
*/
import {
    // increase token supply...
   INCREASE_TOKENSUPPLY,
   INCREASE_TOKENSUPPLY_SUCCESS,
   INCREASE_TOKENSUPPLY_FAILURE,
   //increase token list
   GET_INCREASE_TOKENSUPPLY_LIST,
   GET_INCREASE_TOKENSUPPLY_LIST_SUCCESS,
   GET_INCREASE_TOKENSUPPLY_LIST_FAILURE,
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

/* Increase list methods.. */
export const increaseTokenSupplyList = (request) => ({
    type: GET_INCREASE_TOKENSUPPLY_LIST,
    request: request
});
export const increaseTokenSupplyListSuccess = (response) => ({
    type: GET_INCREASE_TOKENSUPPLY_LIST_SUCCESS,
    payload: response
});
export const increaseTokenSupplyListFailure = (error) => ({
    type: GET_INCREASE_TOKENSUPPLY_LIST_FAILURE,
    payload: error
});