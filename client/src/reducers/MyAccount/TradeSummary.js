/**
 * For Trade Summary Reducer
 */
import {

    //For Trade Summary
    LIST_TRADE_SUMMARY,
    LIST_TRADE_SUMMARY_SUCCESS,
    LIST_TRADE_SUMMARY_FAILURE,
  
  } from "Actions/types";
  
  /**
   * initial Trade Summary
   */
  const INIT_STATE = {
    tradeSummaryData: [],
    loading: false
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      //For Trade Summary
      case LIST_TRADE_SUMMARY:
        return { ...state, loading: true };
  
      case LIST_TRADE_SUMMARY_SUCCESS:
        return { ...state, loading: false, tradeSummaryData: action.payload};
  
      case LIST_TRADE_SUMMARY_FAILURE:
        return { ...state, loading: false };
  
      default:
        return { ...state };
    }
  };
  