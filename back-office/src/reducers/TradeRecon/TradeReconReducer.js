// Reducer For Handle Tarde Recon List Active ORders ANd Settle Orders By Tejas
// import types
import {
  GET_TRADE_RECON_LIST,
  GET_TRADE_RECON_LIST_SUCCESS,
  GET_TRADE_RECON_LIST_FAILURE,
  ACTIVE_ORDER_LIST,
  ACTIVE_ORDER_LIST_SUCCESS,
  ACTIVE_ORDER_LIST_FAILURE,
  SETTLE_ORDER,
  SETTLE_ORDER_SUCCESS,
  SETTLE_ORDER_FAILURE,
  GET_PAIR_LIST,
  GET_PAIR_LIST_SUCCESS,
  GET_PAIR_LIST_FAILURE,
  SET_TRADE_RECON,
  SET_TRADE_RECON_SUCCESS,
  SET_TRADE_RECON_FAILURE,
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  tradeReconList: [],
  activeOrders: [],
  settleOrder: [],
  pairList: [],
  pairListLoading:false,
  loading: false,
  error: [],
  setTradeReconList: [],
  setTradeReconError: [],
  setTradeReconLoading: false,
  TotalCount:0,
  TotalPages:0
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    // get Trade Recon List
    case GET_TRADE_RECON_LIST:
    case ACTIVE_ORDER_LIST:
    case SETTLE_ORDER:
      return { ...state, loading: true };

    // set Data Of Trade Recon List
    case GET_TRADE_RECON_LIST_SUCCESS:
      return { ...state, tradeReconList: action.payload.Response,TotalCount:action.payload.TotalCount ,TotalPages:action.payload.TotalPages, loading: false, error: [] };

    // Display Error for Trade Recon List failure
    case GET_TRADE_RECON_LIST_FAILURE:
      return { ...state, loading: false, tradeReconList: [], error: action.payload,TotalCount:0 ,TotalPages:action.payload.TotalPages  };

      // set Data Of Active Order List
    case ACTIVE_ORDER_LIST_SUCCESS:
      return { ...state, activeOrders: action.payload, loading: false };

    // Display Error for Active Order List failure
    case ACTIVE_ORDER_LIST_FAILURE:
      return { ...state, loading: false, activeOrders: [] };

    // set Data Of Settle Order
    case SETTLE_ORDER_SUCCESS:
      return { ...state, settleOrder: action.payload, loading: false };

    // Display Error for Settle Order failure
    case SETTLE_ORDER_FAILURE:
      return { ...state, loading: false, settleOrder: [] };

    // get Pair List
    case GET_PAIR_LIST:
      return { ...state, pairListLoading: true };

    // set Data Of Pair List
    case GET_PAIR_LIST_SUCCESS:
      return { ...state, pairList: action.payload, pairListLoading: false };

    // Display Error for Pair List failure
    case GET_PAIR_LIST_FAILURE:
      return { ...state, pairListLoading: false, pairList: [] };

    // Set Trade Recon
    case SET_TRADE_RECON:
      return { ...state, setTradeReconLoading: true, setTradeReconList: [], setTradeReconError: [] };

    // Set Trade Recon
    case SET_TRADE_RECON_SUCCESS:
      return { ...state, setTradeReconList: action.payload, setTradeReconLoading: false, setTradeReconError: [] };

    // Display Error for Set Trade Recon failure
    case SET_TRADE_RECON_FAILURE:
      return { ...state, setTradeReconLoading: false, setTradeReconList: [], setTradeReconError: action.payload };

    default:
      return { ...state };
  }
};
