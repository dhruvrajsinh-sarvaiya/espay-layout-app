/**
 * Top Losers Actions
 */
import {
    //For Top Losers
    LIST_TOP_LOSERS,
    LIST_TOP_LOSERS_SUCCESS,
    LIST_TOP_LOSERS_FAILURE,
  
  } from "../types";
  
  //For Top Losers
  /**
   * Redux Action To Top Losers
   */
  export const listTopLosers = () => ({
    type: LIST_TOP_LOSERS
  });
  
  /**
   * Redux Action To Top Losers Success
   */
  export const listTopLosersSuccess = response => ({
    type: LIST_TOP_LOSERS_SUCCESS,
    payload: response
  });
  
  /**
   * Redux Action To Top Losers Failure
   */
  export const listTopLosersFailure = (error) => ({
    type: LIST_TOP_LOSERS_FAILURE,
    payload: error
  });
  
 