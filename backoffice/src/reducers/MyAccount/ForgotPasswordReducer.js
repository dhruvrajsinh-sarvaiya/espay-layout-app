/**
 * Reset Password Reducer
 */
import {
  //For Reset Password
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  resetpassword: [],
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FORGOT_PASSWORD:
      return { ...state, loading: true };

    case FORGOT_PASSWORD_SUCCESS:
      return { ...state, loading: false, resetpassword: action.payload };

    case FORGOT_PASSWORD_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
