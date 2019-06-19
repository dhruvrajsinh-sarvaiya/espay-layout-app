/**
 * Auther : Kevin Ladani
 * Updated By : Salim Deraiya
 * Created : 16/10/2018
 * Reset Password Actions
 */

import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  loading: false,
  data: [],
  error: '',
  redirect: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) 
  {
    case RESET_PASSWORD:
      return { ...state, loading: true };

    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case RESET_PASSWORD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return { ...state };
  }
};