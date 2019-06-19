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

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For Display PatternsAssignments
    case DISPALY_PATTERNS_ASSIGNMENTS:
      return { ...state, Loading: true };

    case DISPALY_PATTERNS_ASSIGNMENTS_SUCCESS:
      return { ...state, Loading: false, displayCustomersData: action.payload };

    case DISPALY_PATTERNS_ASSIGNMENTS_FAILURE:
      return { ...state, Loading: false };

    //For Delete PatternsAssignments
    case DELETE_PATTERNS_ASSIGNMENTS:
      return { ...state, loading: true };

    case DELETE_PATTERNS_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        displayPatternsAssignmentData: action.payload
      };

    case DELETE_PATTERNS_ASSIGNMENTS_FAILURE:
      return { ...state, loading: false };

    //For Add PatternsAssignments
    case ADD_PATTERNS_ASSIGNMENTS:
      return { ...state, loading: true };

    case ADD_PATTERNS_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        displayPatternsAssignmentData: action.payload
      };

    case ADD_PATTERNS_ASSIGNMENTS_FAILURE:
      return { ...state, loading: false };

    //For Edit PatternsAssignments
    case EDIT_PATTERNS_ASSIGNMENTS:
      return { ...state, loading: true };

    case EDIT_PATTERNS_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        displayPatternsAssignmentData: action.payload
      };

    case EDIT_PATTERNS_ASSIGNMENTS_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
