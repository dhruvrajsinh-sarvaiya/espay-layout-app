// Reducer For Handle Trading Ledger List  By Tejas
// import types
import {
  GET_TRADING_LEDGER_DATA,
  GET_TRADING_LEDGER_DATA_SUCCESS,
  GET_TRADING_LEDGER_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  tradeLedgerList: [],
  loading: false,
  error: [],
  tradeLedgerBit: 1,
  TotalCount:0,
  TotalPages:0
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {

    // get Trading Ledger List
    case GET_TRADING_LEDGER_DATA:
      return { ...state, loading: true,tradeLedgerList:[],error:[] };

    // set Data Of Trading Ledger List
    case GET_TRADING_LEDGER_DATA_SUCCESS:
      return { ...state, tradeLedgerList: action.payload.Response,TotalCount:action.payload.TotalCount,TotalPages:action.payload.TotalPages, loading: false, error: [], tradeLedgerBit: ++state.tradeLedgerBit };

    // Display Error for Trading Ledger List failure
    case GET_TRADING_LEDGER_DATA_FAILURE:

      return { ...state, loading: false, tradeLedgerList: [], TotalCount:0,error: action.payload,TotalPages:action.payload.TotalPages, tradeLedgerBit: ++state.tradeLedgerBit };

    default:
      return { ...state };
  }
};
