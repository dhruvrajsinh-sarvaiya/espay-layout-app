// Reducer For Handle Tarde Summary List  By Tejas
// import types
import {
  GET_TRADE_SUMMARY_LIST,
  GET_TRADE_SUMMARY_LIST_SUCCESS,
  GET_TRADE_SUMMARY_LIST_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  tradeSummaryList: [],
  loading: false,
  error: [],
  tradeSummaryBit: 1,
  TotalCount:0,
  TotalPages:0
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }

  switch (action.type) {
    // get Trade Summary List
    case GET_TRADE_SUMMARY_LIST:
      return { ...state, loading: true,tradeSummaryList:[],error:[] };

    // set Data Of Trade Summary List
    case GET_TRADE_SUMMARY_LIST_SUCCESS:
      return { ...state, tradeSummaryList: action.payload.Response, loading: false, TotalCount:action.payload.TotalCount ,TotalPages:action.payload.TotalPages, error: [], tradeSummaryBit: ++state.tradeSummaryBit };

    // Display Error for Trade Summary List failure
    case GET_TRADE_SUMMARY_LIST_FAILURE:

      return { ...state, loading: false, tradeSummaryList: [], error: action.payload, TotalCount:0 ,TotalPages:action.payload.TotalPages , tradeSummaryBit: ++state.tradeSummaryBit };

    default:
      return { ...state };
  }
};
