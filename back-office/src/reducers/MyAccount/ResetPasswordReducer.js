/**
 * Reset Password Reducer
 */
import {
  //For Reset Password
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  resetpassword: [],
  loading: false
};

export default (state , action) => {
  if (typeof state === 'undefined') {
      return INIT_STATE
  }
  switch (action.type) {
    //For Signup User with Email
    case RESET_PASSWORD:
      return { ...state, loading: true };

    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, resetpassword: action.payload };

    case RESET_PASSWORD_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
