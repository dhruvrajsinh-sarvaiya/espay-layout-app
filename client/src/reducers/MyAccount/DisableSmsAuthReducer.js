/**
 * Disable SMS Auth Reducers
 */
import {
    //For Disable Send SMS Auth
    DISABLE_SEND_SMSAUTH,
    DISABLE_SEND_SMSAUTH_SUCCESS,
    DISABLE_SEND_SMSAUTH_FAILURE,
  
    //For Disable Submit Send SMS Auth
    DISABLE_SUBMIT_SEND_SMSAUTH,
    DISABLE_SUBMIT_SEND_SMSAUTH_SUCCESS,
    DISABLE_SUBMIT_SEND_SMSAUTH_FAILURE
  } from "Actions/types";
  
  /**
   * initial SMS Auth
   */
  const INIT_STATE = {
    disablesmsauth: [],
    loading: false
  };
  
  export default (state = INIT_STATE, action) => {
    switch (action.type) {
      //For Send SMS Auth
      case DISABLE_SEND_SMSAUTH:
        return { ...state, loading: true };
  
      case DISABLE_SEND_SMSAUTH_SUCCESS:
        return { ...state, loading: false, disablesmsauth1: action.payload };
  
      case DISABLE_SEND_SMSAUTH_FAILURE:
        return { ...state, loading: false };
  
      //For Submit Send SMS Auth
      case DISABLE_SUBMIT_SEND_SMSAUTH:
        return { ...state, loading: true };
  
      case DISABLE_SUBMIT_SEND_SMSAUTH_SUCCESS:
        return { ...state, loading: false, disablesmsauth1: action.payload };
  
      case DISABLE_SUBMIT_SEND_SMSAUTH_FAILURE:
        return { ...state, loading: false };
  
      default:
        return { ...state };
    }
  };
  