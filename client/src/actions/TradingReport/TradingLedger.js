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
  TRADING_LEDGER_REFRESH
} from "../types";

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
  payload: list
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
