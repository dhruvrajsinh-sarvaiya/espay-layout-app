/*
 * Created By Megha Kariya 
 * Date :- 09-01-2019
 * Reducer File for Trade Summary Report
*/
/**
 * For Trade Summary Reducer
 */
import {

  //For Trade Summary
  GET_TRADE_SUMMARY_DATA,
  GET_TRADE_SUMMARY_DATA_SUCCESS,
  GET_TRADE_SUMMARY_DATA_FAILURE,
  GET_PAIR_LIST_DATA,
  GET_PAIR_LIST_DATA_SUCCESS,
  GET_PAIR_LIST_DATA_FAILURE,

} from "Actions/types";

/**
 * initial Trade Summary
 */
const INIT_STATE = {
  tradeSummaryData: [],
  loading: false,
  error: [],
  pairList: []
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }

  switch (action.type) {
    //For Trade Summary
    case GET_TRADE_SUMMARY_DATA:
      return { ...state, loading: true };

    case GET_TRADE_SUMMARY_DATA_SUCCESS:
      return { ...state, loading: false, tradeSummaryData: action.payload, error: [], pairList: [] };

    case GET_TRADE_SUMMARY_DATA_FAILURE:
      return { ...state, loading: false, tradeSummaryData: [], error: action.payload, pairList: [] };

    case GET_PAIR_LIST_DATA:
      return { ...state, loading: true };

    // set Data Of Pair List
    case GET_PAIR_LIST_DATA_SUCCESS:
      return { ...state, pairList: action.payload, loading: false, tradeSummaryData: [], error: [] };

    // Display Error for Pair List failure
    case GET_PAIR_LIST_DATA_FAILURE:
      return { ...state, loading: false, pairList: [], tradeSummaryData: [], error: [] };

    default:
      return { ...state };
  }
};
