/**
 * Top Gainers Actions
 */
import {
    //For Top Gainers
    LIST_TOP_GAINERS,
    LIST_TOP_GAINERS_SUCCESS,
    LIST_TOP_GAINERS_FAILURE,
  
  } from "../types";
  
  //For Top Gainers
  /**
   * Redux Action To Top Gainers
   */
  export const listTopGainers = () => ({
    type: LIST_TOP_GAINERS
  });
  
  /**
   * Redux Action To Top Gainers Success
   */
  export const listTopGainersSuccess = response => ({
    type: LIST_TOP_GAINERS_SUCCESS,
    payload: response
  });
  
  /**
   * Redux Action To Top Gainers Failure
   */
  export const listTopGainersFailure = (error) => ({
    type: LIST_TOP_GAINERS_FAILURE,
    payload: error
  });
  
 