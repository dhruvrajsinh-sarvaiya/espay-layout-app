/**
 * Display PatternsAssignments Actions
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
} from "../types";

//For Display PatternsAssignments
/**
 * Redux Action To Display PatternsAssignments
 */
export const displayPatternsAssignments = () => ({
  type: DISPALY_PATTERNS_ASSIGNMENTS
});

/**
 * Redux Action To Display PatternsAssignments Success
 */
export const displayPatternsAssignmentsSuccess = response => ({
  type: DISPALY_PATTERNS_ASSIGNMENTS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Display PatternsAssignments Failure
 */
export const displayPatternsAssignmentsFailure = error => ({
  type: DISPALY_PATTERNS_ASSIGNMENTS_FAILURE,
  payload: error
});

//For Delete PatternsAssignments
/**
 * Redux Action To Delete PatternsAssignments
 */
export const deletePatternsAssignments = user => ({
  type: DELETE_PATTERNS_ASSIGNMENTS,
  payload: user
});

/**
 * Redux Action To Delete PatternsAssignments Success
 */
export const deletePatternsAssignmentsSuccess = response => ({
  type: DELETE_PATTERNS_ASSIGNMENTS_SUCCESS,
  payload: response.data
});

/**
 * Redux Action To Delete PatternsAssignments Failure
 */
export const deletePatternsAssignmentsFailure = error => ({
  type: DELETE_PATTERNS_ASSIGNMENTS_FAILURE,
  payload: error
});

//For Add PatternsAssignments
/**
 * Redux Action To Add PatternsAssignments
 */
export const addPatternsAssignments = user => ({
  type: ADD_PATTERNS_ASSIGNMENTS,
  payload: user
});

/**
 * Redux Action To Add PatternsAssignments Success
 */
export const addPatternsAssignmentsSuccess = data => ({
  type: ADD_PATTERNS_ASSIGNMENTS_SUCCESS,
  payload: data
});

/**
 * Redux Action To Add PatternsAssignments Failure
 */
export const addPatternsAssignmentsFailure = error => ({
  type: ADD_PATTERNS_ASSIGNMENTS_FAILURE,
  payload: error
});

//For Edit PatternsAssignments
/**
 * Redux Action To Edit PatternsAssignments
 */
export const editPatternsAssignments = user => ({
  type: EDIT_PATTERNS_ASSIGNMENTS,
  payload: user
});

/**
 * Redux Action To Edit PatternsAssignments Success
 */
export const editPatternsAssignmentsSuccess = data => ({
  type: EDIT_PATTERNS_ASSIGNMENTS_SUCCESS,
  payload: data
});

/**
 * Redux Action To Edit PatternsAssignments Failure
 */
export const editPatternsAssignmentsFailure = error => ({
  type: EDIT_PATTERNS_ASSIGNMENTS_FAILURE,
  payload: error
});
