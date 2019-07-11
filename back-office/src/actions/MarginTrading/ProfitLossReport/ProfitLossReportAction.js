/**
 *   Developer : vishva shah
 *   Date : 27-04-2019
 *   Component: Profit Loss Report action 
 */
import {
    GET_PROFITLOSS_LIST,
    GET_PROFITLOSS_LIST_SUCCESS,
    GET_PROFITLOSS_LIST_FAILURE,
} from "Actions/types";
//get action
export const getProfitLossList = data => ({
    type: GET_PROFITLOSS_LIST,
    payload: data
});

export const getProfitLossListSuccess = response => ({
    type: GET_PROFITLOSS_LIST_SUCCESS,
    payload: response
});

export const getProfitLossListFailure = error => ({
    type: GET_PROFITLOSS_LIST_FAILURE,
    payload: error
});

