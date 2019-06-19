/**
 * Auth User Reducers
 */
import {
  //For Send SMS Auth
  SEND_SMSAUTH,
  SEND_SMSAUTH_SUCCESS,
  SEND_SMSAUTH_FAILURE,

  //For Submit Send SMS Auth
  SUBMIT_SEND_SMSAUTH,
  SUBMIT_SEND_SMSAUTH_SUCCESS,
  SUBMIT_SEND_SMSAUTH_FAILURE
} from "Actions/types";

/**
 * initial SMS Auth
 */
const INIT_STATE = {
  smsauth: [],
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For Send SMS Auth
    case SEND_SMSAUTH:
      return { ...state, loading: true };

    case SEND_SMSAUTH_SUCCESS:
      return { ...state, loading: false, smsauth: action.payload };

    case SEND_SMSAUTH_FAILURE:
      return { ...state, loading: false };

    //For Submit Send SMS Auth
    case SUBMIT_SEND_SMSAUTH:
      return { ...state, loading: true };

    case SUBMIT_SEND_SMSAUTH_SUCCESS:
      return { ...state, loading: false, smsauth: action.payload };

    case SUBMIT_SEND_SMSAUTH_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
