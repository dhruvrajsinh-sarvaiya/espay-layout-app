/**
 * Roles Reducer
 */

import {
  //For List Roles
  LIST_ROLES,
  LIST_ROLES_SUCCESS,
  LIST_ROLES_FAILURE,

  //For Delete Roles
  DELETE_ROLES,
  DELETE_ROLES_SUCCESS,
  DELETE_ROLES_FAILURE,

  //For Add Roles
  ADD_ROLES,
  ADD_ROLES_SUCCESS,
  ADD_ROLES_FAILURE,

  //For Edit Roles
  EDIT_ROLES,
  EDIT_ROLES_SUCCESS,
  EDIT_ROLES_FAILURE,

  //For Get Edit Roles By Id
  GET_ROLES_BY_ID,
  GET_ROLES_BY_ID_SUCCESS,
  GET_ROLES_BY_ID_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  data: [],
  list: [],
  Loading: false
};

export default (state , action) => {
  if (typeof state === 'undefined') {
      return INIT_STATE
  }
  switch (action.type) {
    //For List Roles
    case LIST_ROLES:
    case DELETE_ROLES:
    case ADD_ROLES:
    case EDIT_ROLES:
    case GET_ROLES_BY_ID:
      return { ...state, loading: true };

    case LIST_ROLES_SUCCESS:
      return { ...state, loading: false, list: action.payload };

    case LIST_ROLES_FAILURE:
    case DELETE_ROLES_FAILURE:
    case ADD_ROLES_FAILURE:
    case EDIT_ROLES_FAILURE:
    case GET_ROLES_BY_ID_FAILURE:
      return { ...state, loading: false };

    case DELETE_ROLES_SUCCESS:
    case ADD_ROLES_SUCCESS:
    case EDIT_ROLES_SUCCESS:
    case GET_ROLES_BY_ID_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    default:
      return { ...state };
  }
};
