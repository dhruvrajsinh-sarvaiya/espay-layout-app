/**
 * Trade Summary Actions
 */
import {
  //For Trade Summary
  LIST_TRADE_SUMMARY,
  LIST_TRADE_SUMMARY_SUCCESS,
  LIST_TRADE_SUMMARY_FAILURE
} from "../types";

//For Trade Summary
/**
 * Redux Action To Trade Summary
 */
export const listTradeSummary = () => ({
  type: LIST_TRADE_SUMMARY
});

/**
 * Redux Action To Trade Summary Success
 */
export const listTradeSummarySuccess = response => ({
  type: LIST_TRADE_SUMMARY_SUCCESS,
  payload: response
});

/**
 * Redux Action To Trade Summary Failure
 */
export const listTradeSummaryFailure = error => ({
  type: LIST_TRADE_SUMMARY_FAILURE,
  payload: error
});
