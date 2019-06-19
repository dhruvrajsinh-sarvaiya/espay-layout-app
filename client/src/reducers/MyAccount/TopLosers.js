/**
 * For Top Losers Reducer
 */
import {

    //For Top Losers
    LIST_TOP_LOSERS,
    LIST_TOP_LOSERS_SUCCESS,
    LIST_TOP_LOSERS_FAILURE,
  
  } from "Actions/types";
  
  /**
   * initial Top Losers
   */
  const INIT_STATE = {
    topLosersData: [],
    loading: false
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      //For Top Losers
      case LIST_TOP_LOSERS:
        return { ...state, loading: true };
  
      case LIST_TOP_LOSERS_SUCCESS:
        return { ...state, loading: false, topLosersData: action.payload};
  
      case LIST_TOP_LOSERS_FAILURE:
        return { ...state, loading: false };
  
      default:
        return { ...state };
    }
  };
  