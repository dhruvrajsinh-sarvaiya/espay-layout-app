// Reducer For Handle Total Count  By Tejas
// import types
import {
  GET_USER_TRADE_COUNT,
  GET_USER_TRADE_COUNT_SUCCESS,
  GET_USER_TRADE_COUNT_FAILURE,

  GET_CONFIGURATION_COUNT,
  GET_CONFIGURATION_COUNT_SUCCESS,
  GET_CONFIGURATION_COUNT_FAILURE,

  GET_TRADE_SUMMARY_COUNT,
  GET_TRADE_SUMMARY_COUNT_SUCCESS,
  GET_TRADE_SUMMARY_COUNT_FAILURE,

  GET_USER_MARKET_COUNT,
  GET_USER_MARKET_COUNT_SUCCESS,
  GET_USER_MARKET_COUNT_FAILURE,

  GET_REPORT_COUNT,
  GET_REPORT_COUNT_SUCCESS,
  GET_REPORT_COUNT_FAILURE,

} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  userTradeCounts: [],
  configurationsCounts: [],
  tradeSummaryCounts: [],
  userMarketCount: [],
  reportTotalCounts: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {

    // get Total Count
    case GET_USER_TRADE_COUNT:
      return { ...state, loading: true, userTradeCounts: [] };

    // set Data Of Total Count
    case GET_USER_TRADE_COUNT_SUCCESS:
      return { ...state, userTradeCounts: action.payload, loading: false };

    // Display Error for Total Count failure
    case GET_USER_TRADE_COUNT_FAILURE:

      return { ...state, loading: false, userTradeCounts: [] };

    // get Total Count
    case GET_CONFIGURATION_COUNT:
      return { ...state, loading: true, configurationsCounts: [] };

    // set Data Of Total Count
    case GET_CONFIGURATION_COUNT_SUCCESS:
      return { ...state, configurationsCounts: action.payload, loading: false };

    // Display Error for Total Count failure
    case GET_CONFIGURATION_COUNT_FAILURE:

      return { ...state, loading: false, configurationsCounts: [] };

    // get Total Count
    case GET_TRADE_SUMMARY_COUNT:
      return { ...state, loading: true, tradeSummaryCounts: [] };

    // set Data Of Total Count
    case GET_TRADE_SUMMARY_COUNT_SUCCESS:
      return { ...state, tradeSummaryCounts: action.payload, loading: false };

    // Display Error for Total Count failure
    case GET_TRADE_SUMMARY_COUNT_FAILURE:

      return { ...state, loading: false, tradeSummaryCounts: [] };

    // get Total Count
    case GET_USER_MARKET_COUNT:
      return { ...state, loading: true, userMarketCount: [] };

    // set Data Of Total Count
    case GET_USER_MARKET_COUNT_SUCCESS:
      return { ...state, userMarketCount: action.payload, loading: false };

    // Display Error for Total Count failure
    case GET_USER_MARKET_COUNT_FAILURE:

      return { ...state, loading: false, userMarketCount: [] };

    // get report Total Count
    case GET_REPORT_COUNT:
      return { ...state, loading: true, reportTotalCounts: [] };

    // set Data Of report Total Count
    case GET_REPORT_COUNT_SUCCESS:
      return { ...state, reportTotalCounts: action.payload, loading: false };

    // Display Error for report Total Count failure
    case GET_REPORT_COUNT_FAILURE:

      return { ...state, loading: false, reportTotalCounts: [] };

    default:
      return { ...state };
  }
};
