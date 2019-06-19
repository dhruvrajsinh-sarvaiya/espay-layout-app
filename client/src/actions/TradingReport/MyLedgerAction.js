/**
 * Auther : Tejas Fauswami
 * Created : 29/10/2018
 * My Ledger Actions
 */

// import neccessary action types
import {
    MY_LEDGER,
    MY_LEDGER_SUCCESS,
    MY_LEDGER_FAILURE,
  } from "../types";
  
  /**
   * Use: used to handle transaction history action type
   * Input: Transaction History Request
   * Request contain start date, end date, order type,status
   */
  export const myLedger = myLedgerRequest => ({
    type: MY_LEDGER,
    payload: myLedgerRequest
  });
  
  /**
   * Use: used to handle My Ledger success action type
   * Input: My LEDGER or response from API or sagas
   */
  export const myLedgerSuccess = response => ({
    type: MY_LEDGER_SUCCESS,
    payload: response
  });
  
  /**
   * Use: used to handle my Ledger success action type
   * Input: my Ledger List Error  or response from API or sagas
   */
  export const myLedgerFailure = error => ({
    type: MY_LEDGER_FAILURE,
    payload: error.ErrorCode
  });
 
  