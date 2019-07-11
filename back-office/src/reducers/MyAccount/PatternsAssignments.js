/**
 * PatternsAssignments Reducer
 */
import {
  //For Display PatternsAssignments
  DISPALY_PATTERNS_ASSIGNMENTS,
  DISPALY_PATTERNS_ASSIGNMENTS_SUCCESS,
  DISPALY_PATTERNS_ASSIGNMENTS_FAILURE,

  //For Delete PatternsAssignments
  DELETE_PATTERNS_ASSIGNMENTS,
  DELETE_PATTERNS_ASSIGNMENTS_SUCCESS,
  DELETE_PATTERNS_ASSIGNMENTS_FAILURE,

  //For Edit PatternsAssignments
  EDIT_PATTERNS_ASSIGNMENTS,
  EDIT_PATTERNS_ASSIGNMENTS_SUCCESS,
  EDIT_PATTERNS_ASSIGNMENTS_FAILURE,

  //For Add PatternsAssignments
  ADD_PATTERNS_ASSIGNMENTS,
  ADD_PATTERNS_ASSIGNMENTS_SUCCESS,
  ADD_PATTERNS_ASSIGNMENTS_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  displayCustomersData: [],
  Loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }
  switch (action.type) {
    //For Display PatternsAssignments
    case DISPALY_PATTERNS_ASSIGNMENTS:
    case DELETE_PATTERNS_ASSIGNMENTS:
    case ADD_PATTERNS_ASSIGNMENTS:
    case EDIT_PATTERNS_ASSIGNMENTS:
      return { ...state, Loading: true };

    case DISPALY_PATTERNS_ASSIGNMENTS_SUCCESS:
      return { ...state, Loading: false, displayCustomersData: action.payload };

    case DISPALY_PATTERNS_ASSIGNMENTS_FAILURE:
    case DELETE_PATTERNS_ASSIGNMENTS_FAILURE:
    case ADD_PATTERNS_ASSIGNMENTS_FAILURE:
    case EDIT_PATTERNS_ASSIGNMENTS_FAILURE:
      return { ...state, Loading: false };

    case DELETE_PATTERNS_ASSIGNMENTS_SUCCESS:
    case EDIT_PATTERNS_ASSIGNMENTS_SUCCESS:
    case ADD_PATTERNS_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        displayPatternsAssignmentData: action.payload
      };

    default:
      return { ...state };
  }
};
