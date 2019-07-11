// Reducer For Handle User Trade List  By Tejas
// import types
import {
  GET_USER_TRADE_DATA,
  GET_USER_TRADE_DATA_SUCCESS,
  GET_USER_TRADE_DATA_FAILURE,
  GET_USER_TRADE_TOTAL_DATA,
  GET_USER_TRADE_TOTAL_DATA_SUCCESS,
  GET_USER_TRADE_TOTAL_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  userTradeData: [],
  userTradeTotal: [],
  loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {

    // get User Trade List
    case GET_USER_TRADE_DATA:
    // get User Trade List
    case GET_USER_TRADE_TOTAL_DATA:
      return { ...state, loading: true };

    // set Data Of User Trade List
    case GET_USER_TRADE_DATA_SUCCESS:
      return { ...state, userTradeData: action.payload, loading: false };

    // Display Error for User Trade List failure
    case GET_USER_TRADE_DATA_FAILURE:
      return { ...state, loading: false, userTradeData: [] };

    // set Data Of User Trade List
    case GET_USER_TRADE_TOTAL_DATA_SUCCESS:
      return { ...state, userTradeTotal: action.payload, loading: false };

    // Display Error for User Trade List failure
    case GET_USER_TRADE_TOTAL_DATA_FAILURE:
      return { ...state, loading: false, userTradeTotal: [] };

    default:
      return { ...state };
  }
};
