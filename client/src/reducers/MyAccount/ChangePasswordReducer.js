/**
 * Change Password Reducer
 */
import {

  //For Change Password
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE

} from "Actions/types";

/**
 * initial Change Password
 */
const INIT_STATE = {
  loading: false,
  data: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For Change Password
    case CHANGE_PASSWORD:
      return { ...state, loading: true, data: '' };

    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case CHANGE_PASSWORD_FAILURE:
      return { ...state, loading: false, data: action.payload };

    default:
      return { ...state };
  }
};
