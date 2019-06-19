// Reducer For Handle User Trade List  By Tejas
// import types
import {
  GET_TRADE_SUMMARY_TOTAL_DATA,
  GET_TRADE_SUMMARY_TOTAL_DATA_SUCCESS,
  GET_TRADE_SUMMARY_TOTAL_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  tradeSummaryTotal: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // get Trade Summary Total
    case GET_TRADE_SUMMARY_TOTAL_DATA:
      return { ...state, loading: true };

    // set Data Of Trade Summary Total
    case GET_TRADE_SUMMARY_TOTAL_DATA_SUCCESS:
      return { ...state, tradeSummaryTotal: action.payload, loading: false };

    // Display Error for Trade Summary Total failure
    case GET_TRADE_SUMMARY_TOTAL_DATA_FAILURE:

      return { ...state, loading: false, tradeSummaryTotal: [] };

    default:
      return { ...state };
  }
};
