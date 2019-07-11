/**
 * Auther : Salim Deraiya
 * Created : 09/10/2018
 * SLA Configuration Reducers
 */
import {
  //List SLA Configuration
  LIST_SLA,
  LIST_SLA_SUCCESS,
  LIST_SLA_FAILURE,

  //Edit SLA Configuration
  EDIT_SLA,
  EDIT_SLA_SUCCESS,
  EDIT_SLA_FAILURE,

  //Add SLA Configuration
  ADD_SLA,
  ADD_SLA_SUCCESS,
  ADD_SLA_FAILURE,

  //Delete SLA Configuration
  DELETE_SLA,
  DELETE_SLA_SUCCESS,
  DELETE_SLA_FAILURE
} from "Actions/types";

/*
 * Initial State
 */
const INIT_STATE = {
  loading: false,
  conversion: [],
  data: [],
  list: [],
  ext_flag: false,
};

//Check Action for SLA Configuration...
export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }
  switch (action.type) {
    //List SLA Configuration..
    case LIST_SLA:
      return { ...state, loading: true, ext_flag: false, data: '' };

    case LIST_SLA_SUCCESS:
    case LIST_SLA_FAILURE:
      return { ...state, loading: false, list: action.payload };

    //Edit SLA Configuration..
    case EDIT_SLA:
    case ADD_SLA:
    case DELETE_SLA:
      return { ...state, loading: true };

    case EDIT_SLA_SUCCESS:
    case EDIT_SLA_FAILURE:
    case ADD_SLA_SUCCESS:
    case ADD_SLA_FAILURE:
      return { ...state, loading: false, data: action.payload };

    case DELETE_SLA_SUCCESS:
    case DELETE_SLA_FAILURE:
      return { ...state, loading: false, conversion: action.payload, ext_flag: true };

    default:
      return { ...state };
  }
};
