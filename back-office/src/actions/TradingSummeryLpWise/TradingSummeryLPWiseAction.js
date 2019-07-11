// Actions For Trading summary LP wise By Karan Joshi

//import types
import {
  TRADING_SUMMARY_LPWISE_LIST,
  TRADING_SUMMARY_LPWISE_LIST_SUCESSFUL,
  TRADING_SUMMARY_LPWISE_LIST_FAIL
} from "Actions/types";

export const getTradingSummeryLpwiseList = Data => ({
  type: TRADING_SUMMARY_LPWISE_LIST,
  payload: { Data }
});

export const getTradingSummeryLpwiseListSucessfull = response => ({
  type: TRADING_SUMMARY_LPWISE_LIST_SUCESSFUL,
  payload: response
});

export const getTradingSummeryLpwiseListFail = error => ({
  type: TRADING_SUMMARY_LPWISE_LIST_FAIL,
  payload: error
});
