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

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For List Roles
    case LIST_ROLES:
      return { ...state, loading: true };

    case LIST_ROLES_SUCCESS:
      return { ...state, loading: false, list: action.payload };

    case LIST_ROLES_FAILURE:
      return { ...state, loading: false };

    //For Delete Roles
    case DELETE_ROLES:
      return { ...state, loading: true };

    case DELETE_ROLES_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case DELETE_ROLES_FAILURE:
      return { ...state, loading: false };

    //For Add Roles
    case ADD_ROLES:
      return { ...state, loading: true };

    case ADD_ROLES_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case ADD_ROLES_FAILURE:
      return { ...state, loading: false };

    //For Edit Users
    case EDIT_ROLES:
      return { ...state, loading: true };

    case EDIT_ROLES_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case EDIT_ROLES_FAILURE:
      return { ...state, loading: false };

    //For Get Role By Id
    case GET_ROLES_BY_ID:
      return { ...state, loading: true };

    case GET_ROLES_BY_ID_SUCCESS:
      return { ...state, loading: false, data: action.payload };

    case GET_ROLES_BY_ID_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
