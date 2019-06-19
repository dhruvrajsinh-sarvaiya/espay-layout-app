/**
 * Auth User Reducers
 */
import {
  //For Signup with Mobile
  SIGNUP_USERS_MOBILE,
  SIGNUP_USERS_MOBILE_SUCCESS,
  SIGNUP_USERS_MOBILE_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  usermobile: [],
  loading: false,
  error : ''
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For Signup User with Mobile
    case SIGNUP_USERS_MOBILE:
      return { ...state, loading: true, error : '', user : '' };

    case SIGNUP_USERS_MOBILE_SUCCESS:
      return { ...state, loading: false, usermobile: action.payload };

    case SIGNUP_USERS_MOBILE_FAILURE:
      return { ...state, loading: false, error : action.payload };

    default:
      return { ...state };
  }
};
