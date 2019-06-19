/**
 * Users Role Reducer
 */

import {
  LIST_USER_ROLES,
  LIST_USER_ROLES_SUCCESS,
  LIST_USER_ROLES_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  list: [],
  Loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For User Role List
    case LIST_USER_ROLES:
      return { ...state, loading: true };

    case LIST_USER_ROLES_SUCCESS:
      return { ...state, loading: false, list: action.payload };

    case LIST_USER_ROLES_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
