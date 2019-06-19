// Actions For Trading Ledger By Tejas

// import types
import {
    GET_TRADING_LEDGER_DATA,
    GET_TRADING_LEDGER_DATA_SUCCESS,
    GET_TRADING_LEDGER_DATA_FAILURE
  } from "Actions/types";
  
  //action for Trading Ledger List and set type for reducers
  export const getTradingLedgerDataList = Data => ({
    type: GET_TRADING_LEDGER_DATA,
    payload: { Data }
  });
  
  //action for set Success and Trading Ledger List and set type for reducers
  export const getTradingLedgerDataListSuccess = response => ({
    type: GET_TRADING_LEDGER_DATA_SUCCESS,
    payload: response
  });
  
  //action for set failure and error to Trading Ledger List and set type for reducers
  export const getTradingLedgerDataListFailure = error => ({
    type: GET_TRADING_LEDGER_DATA_FAILURE,
    payload: error
  });
  