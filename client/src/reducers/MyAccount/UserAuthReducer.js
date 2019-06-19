/**
 * Auth User Reducers
 */
import {
  //For Signup User with Email
  SIGNUP_USERS,
  SIGNUP_USERS_SUCCESS,
  SIGNUP_USERS_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  user: [],
  loading: false,
  error : ''
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For Signup User with Email
    case SIGNUP_USERS:
      return { ...state, loading: true, error : '', user : '' };

    case SIGNUP_USERS_SUCCESS:
      return { ...state, loading: false, user: action.payload};

    case SIGNUP_USERS_FAILURE:
      return { ...state, loading: false, error : action.payload };

    default:
      return { ...state };
  }
};
