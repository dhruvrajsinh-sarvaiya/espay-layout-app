// Added by Karan Joshi

import {
  TRADING_SUMMARY_LPWISE_LIST,
  TRADING_SUMMARY_LPWISE_LIST_SUCESSFUL,
  TRADING_SUMMARY_LPWISE_LIST_FAIL
} from "Actions/types";

const INIT_STATE = {
  displayCustomerData: [],
  loding: false,
  error: [],
  tradeLedgerlpBit: 1,
  TotalCount:0,
  TotalPages:0

};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    // Display here
    case TRADING_SUMMARY_LPWISE_LIST:
      return { ...state, loading: true };

    case TRADING_SUMMARY_LPWISE_LIST_SUCESSFUL:
      return { ...state, loading: false, displayCustomerData: action.payload.Response, TotalCount:action.payload.TotalCount, TotalPages:action.payload.TotalPages, error: [], tradeLedgerlpBit: ++state.tradeLedgerlpBit };

    case TRADING_SUMMARY_LPWISE_LIST_FAIL:
      return { ...state, loading: false, displayCustomerData: [], TotalCount:0,error:action.payload,TotalPages:action.payload.TotalPages, tradeLedgerlpBit: ++state.tradeLedgerlpBit };

    default:
      return { ...state, loading: false };
  }
};
