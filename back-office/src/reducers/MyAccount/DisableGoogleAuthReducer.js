/**
 * Auther : Kevin Ladani
 * Created : 12/10/2018
 * Updated : 23/10/2018 (Salim Deraiya)
 * Disable Google Auth Widget
 */

import {
  DISABLE_GOOGLE_AUTH,
  DISABLE_GOOGLE_AUTH_SUCCESS,
  DISABLE_GOOGLE_AUTH_FAILURE
} from "Actions/types";

/**
 * initial SMS Auth
 */
const INITIAL_STATE = {
  data: [],
  loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    //For Submit Send SMS Auth
    case DISABLE_GOOGLE_AUTH:
      return { ...state, loading: true, data: '' };

    case DISABLE_GOOGLE_AUTH_SUCCESS:
    case DISABLE_GOOGLE_AUTH_FAILURE:
      return { ...state, loading: false, data: action.payload };

    default:
      return { ...state };
  }
};