/**
 * For Top Gainers Reducer
 */
import {

    //For Top Gainers
    LIST_TOP_GAINERS,
    LIST_TOP_GAINERS_SUCCESS,
    LIST_TOP_GAINERS_FAILURE,
  
  } from "Actions/types";
  
  /**
   * initial Top Gainers
   */
  const INIT_STATE = {
    topGainersData: [],
    loading: false
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      //For Top Gainers
      case LIST_TOP_GAINERS:
        return { ...state, loading: true };
  
      case LIST_TOP_GAINERS_SUCCESS:
        return { ...state, loading: false, topGainersData: action.payload};
  
      case LIST_TOP_GAINERS_FAILURE:
        return { ...state, loading: false };
  
      default:
        return { ...state };
    }
  };
  