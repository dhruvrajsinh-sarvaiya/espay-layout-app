// Reducer for Order Summary Detail Data By Tejas

import { NotificationManager } from "react-notifications";

import {
  GET_ORDER_SUMMARY_DATA,
  GET_ORDER_SUMMARY_DATA_SUCCESS,
  GET_ORDER_SUMMARY_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  orderSummary: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Order Summary Detail
    case GET_ORDER_SUMMARY_DATA:
      return { ...state, loading: true };

    // set Data Of  Order Summary Detail
    case GET_ORDER_SUMMARY_DATA_SUCCESS:
      return { ...state, orderSummary: action.payload, loading: false };

    // Display Error for Order Summary Detail failure
    case GET_ORDER_SUMMARY_DATA_FAILURE:
      NotificationManager.error("Top Losers Data Not Found");
      return { ...state, loading: false, orderSummary: [] };

    default:
      return { ...state };
  }
};
