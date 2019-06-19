/**
 * Auther : Nirmit Waghela
 * Created : 3/10/2018
 * Trading Ledger Actions
 */
 
// import neccessary action types
import {
  TRADING_LEDGER,
  TRADING_LEDGER_SUCCESS,
  TRADING_LEDGER_FAILURE,
  TRADING_LEDGER_REFRESH,
  GET_PAIR_LIST,
  GET_PAIR_LIST_SUCCESS,
  GET_PAIR_LIST_FAILURE,
  GET_CURRENCY_LIST,
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILURE,
  GET_BASE_CURRENCY_LIST,
  GET_BASE_CURRENCY_LIST_SUCCESS,
  GET_BASE_CURRENCY_LIST_FAILURE,
} from "Actions/types";

/**
 * Use: used to handle transaction history action type
 * Input: Transaction History Request
 * Request contain start date, end date, order type,status
 */
export const tradingledger = tradingledgerRequest => ({
  type: TRADING_LEDGER,
  payload: tradingledgerRequest
});

/**
 * Use: used to handle transaction history success action type
 * Input: TRADING LEDGER or response from API or sagas
 */
export const tradingledgerSuccess = list => ({
  type: TRADING_LEDGER_SUCCESS,
  payload: list.Response
});

/**
 * Use: used to handle transaction history success action type
 * Input: Transaction History List Error  or response from API or sagas
 */
export const tradingledgerFailure = error => ({
  type: TRADING_LEDGER_FAILURE,
  payload: error
});

/**
 * Use: used to handle trading ledger success action type
 * Input: trading ledger Request Error  or response from API or sagas
 * Request contain start date, end date, order type,status
 */
export const tradingledgerRefresh = tradingledgerRequest => ({
  type: TRADING_LEDGER_REFRESH,
  payload: { tradingledgerRequest }
});


// code added by devang parekh for getting pair & currency list

export const getLedgerCurrencyList = currencyListRequest => ({
  type: GET_CURRENCY_LIST,
  payload: currencyListRequest
});

export const getLedgerCurrencyListSuccess = list => ({
  type: GET_CURRENCY_LIST_SUCCESS,
  payload: list.Response
});

export const getLedgerCurrencyListFailure = error => ({
  type: GET_CURRENCY_LIST_FAILURE,
  payload: error
});

// end

// Added By Tejas For get BAse Currency 8/2/2019
export const getBaseCurrencyList = currencyListRequest => ({
  type: GET_BASE_CURRENCY_LIST,
  payload: currencyListRequest
});

export const getBaseCurrencyListSuccess = list => ({
  type: GET_BASE_CURRENCY_LIST_SUCCESS,
  payload: list.Response
});

export const getBaseCurrencyListFailure = error => ({
  type: GET_BASE_CURRENCY_LIST_FAILURE,
  payload: error
});
