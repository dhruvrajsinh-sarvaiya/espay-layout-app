/**
 * Auther : Nirmit Waghela
 * Created : 3/10/2018
 * Trading Ledger Reducer
 */
import { NotificationManager } from "react-notifications";

// import neccessary actions types
import {
  TRADING_LEDGER,
  TRADING_LEDGER_SUCCESS,
  TRADING_LEDGER_FAILURE,
  TRADING_LEDGER_REFRESH,
  GET_CURRENCY_LIST,
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILURE,
  GET_BASE_CURRENCY_LIST,
  GET_BASE_CURRENCY_LIST_SUCCESS,
  GET_BASE_CURRENCY_LIST_FAILURE,
} from "Actions/types";

// define intital state for transcation history list
const INIT_STATE = {
  loading: false,
  tradingledgerList: [],
  pairList: [], 
  currencyList: [],
  error: [],
  baseCurrencyList:[],
  baseLoader:false,
  loadingCurrency:false
};

// this export is used to handle action types and its function based on Word which is define in
export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TRADING_LEDGER:
      return { ...state, loading: true };

    case TRADING_LEDGER_REFRESH:
      return { ...state, loading: true, tradingledgerList: [] };

    case TRADING_LEDGER_SUCCESS:
      return { ...state, loading: false, tradingledgerList: action.payload, error: [] };

    case TRADING_LEDGER_FAILURE:
      return { ...state, loading: false, tradingledgerList: [], error: action.payload };

    case GET_CURRENCY_LIST:
      return { ...state, loadingCurrency: true };

    case GET_CURRENCY_LIST_SUCCESS:
      return { ...state, loadingCurrency: false, currencyList: action.payload };

    case GET_CURRENCY_LIST_FAILURE:
      return { ...state, loadingCurrency: false, currencyList: [] };

      case GET_BASE_CURRENCY_LIST:
      return { ...state, baseLoader: true };

    case GET_BASE_CURRENCY_LIST_SUCCESS:
      return { ...state, baseLoader: false, baseCurrencyList: action.payload };

    case GET_BASE_CURRENCY_LIST_FAILURE:
      return { ...state, baseLoader: false, baseCurrencyList: [] };

    default:
      return { ...state };
  }
};
