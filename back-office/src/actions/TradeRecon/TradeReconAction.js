// Actions For Trade Recon By Tejas

// import types
import {
  GET_TRADE_RECON_LIST,
  GET_TRADE_RECON_LIST_SUCCESS,
  GET_TRADE_RECON_LIST_FAILURE,
  SET_TRADE_RECON,
  SET_TRADE_RECON_SUCCESS,
  SET_TRADE_RECON_FAILURE,
  ACTIVE_ORDER_LIST,
  ACTIVE_ORDER_LIST_SUCCESS,
  ACTIVE_ORDER_LIST_FAILURE,
  SETTLE_ORDER,
  SETTLE_ORDER_SUCCESS,
  SETTLE_ORDER_FAILURE,
  GET_PAIR_LIST,
  GET_PAIR_LIST_SUCCESS,
  GET_PAIR_LIST_FAILURE,
} from "Actions/types";

//action for TRADE_RECON List and set type for reducers
export const getTradeReconList = Data => ({
  type: GET_TRADE_RECON_LIST,
  payload: { Data }
});

//action for set Success and TRADE_RECON List and set type for reducers
export const getTradeReconListSuccess = response => ({
  type: GET_TRADE_RECON_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to TRADE_RECON List and set type for reducers
export const getTradeReconListFailure = error => ({
  type: GET_TRADE_RECON_LIST_FAILURE,
  payload: error
});

//action for Active Orders List and set type for reducers
export const getActiveOrders = Data => ({
  type: ACTIVE_ORDER_LIST,
  payload: { Data }
});

//action for set Success and Active Orders List and set type for reducers
export const getActiveOrdersSuccess = response => ({
  type: ACTIVE_ORDER_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Active Orders List and set type for reducers
export const getActiveOrdersFailure = error => ({
  type: ACTIVE_ORDER_LIST_FAILURE,
  payload: error
});

//action for Settle Order and set type for reducers
export const doSettleOrder = Data => ({
  type: SETTLE_ORDER,
  payload: { Data }
});

//action for set Success and Settle Order and set type for reducers
export const settleOrderSuccess = response => ({
  type: SETTLE_ORDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to Settle Order and set type for reducers
export const settleOrderFailure = error => ({
  type: SETTLE_ORDER_FAILURE,
  payload: error.message
});

//action for TRADE_RECON List and set type for reducers
export const getTradePairs = Data => ({
  type: GET_PAIR_LIST,
  payload: Data
});

//action for set Success and TRADE_RECON List and set type for reducers
export const getTradePairsSuccess = response => ({
  type: GET_PAIR_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to TRADE_RECON List and set type for reducers
export const getTradePairsFailure = error => ({
  type: GET_PAIR_LIST_FAILURE,
  payload: error
});

//action for Set TRADE_RECON List and set type for reducers
export const setTradeRecon = Data => ({
  type: SET_TRADE_RECON,
  payload: { Data }
});

//action for set Success and Set TRADE_RECON List and set type for reducers
export const setTradeReconSuccess = response => ({
  type: SET_TRADE_RECON_SUCCESS,
  payload: response
});

//action for set failure and error to Set TRADE_RECON List and set type for reducers
export const setTradeReconFailure = error => ({
  type: SET_TRADE_RECON_FAILURE,
  payload: error
});
