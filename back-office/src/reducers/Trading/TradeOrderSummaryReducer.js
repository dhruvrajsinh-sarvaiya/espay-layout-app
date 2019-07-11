// Reducer For Handle User Trade List  By Tejas
// import types
import {
  GET_ORDER_SUMMARY_TOTAL_DATA,
  GET_ORDER_SUMMARY_TOTAL_DATA_SUCCESS,
  GET_ORDER_SUMMARY_TOTAL_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  orderSummaryTotal: [],
  loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {

    // get Order Summary Total
    case GET_ORDER_SUMMARY_TOTAL_DATA:
      return { ...state, loading: true };

    // set Data Of Order Summary Total
    case GET_ORDER_SUMMARY_TOTAL_DATA_SUCCESS:
      return { ...state, orderSummaryTotal: action.payload, loading: false };

    // Display Error for Order Summary Total failure
    case GET_ORDER_SUMMARY_TOTAL_DATA_FAILURE:

      return { ...state, loading: false, orderSummaryTotal: [] };

    default:
      return { ...state };
  }
};
