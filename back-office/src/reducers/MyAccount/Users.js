/**
 * Reset Password Reducer
 */
import {
  //For Display Users
  DISPALY_USERS,
  DISPALY_USERS_SUCCESS,
  DISPALY_USERS_FAILURE,

  //For Delete Users
  DELETE_USERS,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAILURE,

  //For Add Users
  ADD_USERS,
  ADD_USERS_SUCCESS,
  ADD_USERS_FAILURE,

  //For Edit Users
  EDIT_USERS,
  EDIT_USERS_SUCCESS,
  EDIT_USERS_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INITIAL_STATE = {
  displayUsersData: [],
  Loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    //For Display Users
    case DISPALY_USERS:
    //For Delete Users
    case DELETE_USERS:
    //For Add Users
    case ADD_USERS:
    //For Edit Users
    case EDIT_USERS:
      return { ...state, loading: true };

    case DISPALY_USERS_SUCCESS:
    case EDIT_USERS_SUCCESS:
    case ADD_USERS_SUCCESS:
      return { ...state, loading: false, displayUsersData: action.payload };

    case DELETE_USERS_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case DISPALY_USERS_FAILURE:
    case DELETE_USERS_FAILURE:
    case EDIT_USERS_FAILURE:
    case ADD_USERS_FAILURE:
      return { ...state, loading: false };


    default:
      return { ...state };
  }
};
