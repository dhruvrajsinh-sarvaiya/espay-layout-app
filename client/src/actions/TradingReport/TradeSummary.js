/*
  * Created By Megha Kariya 
  * Date :- 09-01-2019
  * Action File for Trade Summary Report
*/
/**
 * Trade Summary Actions
 */
import {
  //For Trade Summary
  GET_TRADE_SUMMARY_DATA,
  GET_TRADE_SUMMARY_DATA_SUCCESS,
  GET_TRADE_SUMMARY_DATA_FAILURE,
  GET_PAIR_LIST_DATA,
  GET_PAIR_LIST_DATA_SUCCESS,
  GET_PAIR_LIST_DATA_FAILURE,
} from "../types";

//For Trade Summary
/**
 * Redux Action To Trade Summary
 */
export const listTradeSummary = payload => ({
  type: GET_TRADE_SUMMARY_DATA,
  payload: payload
});

/**
 * Redux Action To Trade Summary Success
 */
export const listTradeSummarySuccess = response => ({
  type: GET_TRADE_SUMMARY_DATA_SUCCESS,
  payload: response.Response
});

/**
 * Redux Action To Trade Summary Failure
 */
export const listTradeSummaryFailure = error => ({
  type: GET_TRADE_SUMMARY_DATA_FAILURE,
  payload: error
});

//action for TRADE_RECON List and set type for reducers
export const getTradePairs = Data => ({
  type: GET_PAIR_LIST_DATA,
  payload: { Data }
});

//action for set Success and TRADE_RECON List and set type for reducers
export const getTradePairsSuccess = response => ({
  type: GET_PAIR_LIST_DATA_SUCCESS,
  payload: response.Response
});

//action for set failure and error to TRADE_RECON List and set type for reducers
export const getTradePairsFailure = error => ({
  type: GET_PAIR_LIST_DATA_FAILURE,
  payload: error
});
