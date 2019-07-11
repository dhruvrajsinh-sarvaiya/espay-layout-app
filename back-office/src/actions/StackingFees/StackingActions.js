import {
  GET_TRADING_FEES,
  GET_TRADING_FEES_SUCCESS,
  GET_TRADING_FEES_FAILURE,
  UPDATE_TRADING_FEES,
  UPDATE_TRADING_FEES_SUCCESS,
  UPDATE_TRADING_FEES_FAILURE,
  ADD_TRADING_FEES,
  ADD_TRADING_FEES_SUCCESS,
  ADD_TRADING_FEES_FAILURE
} from "../types";

export const addTradingFees = tradingFees => ({
  type: ADD_TRADING_FEES,
  payload: tradingFees
});

export const addTradingFeesSuccess = tradingFees => ({
  type: ADD_TRADING_FEES_SUCCESS,
  payload: tradingFees
});

export const addTradingFeesFailure = error => ({
  type: ADD_TRADING_FEES_FAILURE,
  payload: error
});

export const getTradingFees = () => ({
  type: GET_TRADING_FEES
});

export const getTradingFeesSuccess = response => ({
  type: GET_TRADING_FEES_SUCCESS,
  payload: response.data
});

export const getTradingFeesFailure = error => ({
  type: GET_TRADING_FEES_FAILURE,
  payload: error
});

export const onUpdateTradingFees = tradingFees => ({
  type: UPDATE_TRADING_FEES,
  payload: tradingFees
});

export const onUpdateTradingFeesSuccess = tradingFees => ({
  type: UPDATE_TRADING_FEES_SUCCESS,
  payload: tradingFees
});

export const onUpdateTradingFeesFail = error => ({
  type: UPDATE_TRADING_FEES_FAILURE,
  payload: error
});
