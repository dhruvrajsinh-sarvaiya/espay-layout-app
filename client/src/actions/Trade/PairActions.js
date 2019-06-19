/* 
    Trading Get Base Pair List Actions By NW 
*/
import {
  GET_PAIR,
  GET_PAIR_SUCCESS,
  GET_PAIR_FAILURE,
  UPDATE_PAIR,
  UPDATE_PAIR_SUCCESS,
  UPDATE_PAIR_FAILURE,
  ADD_TASK,
  ADD_TASK_SUCCESS,
  ADD_TASK_FAILURE,
  GET_TASK,
  GET_TASK_SUCCESS,
  GET_TASK_FAILURE
} from "../types";

/**
 * Redux Action Get Pair List
 */
export const getPairList1 = () => /* (console.log('ACTION', 'getPairList')), */ ({
  type: GET_PAIR
});

/**
 * Redux Action Get Pair List Success
 */
export const getPairListSuccess1 = response => ({
  type: GET_PAIR_SUCCESS,
  payload: response.data
});

/**
 * Redux Action Get Update Pair List Failure
 */
export const getPairListFailure1 = error => ({
  type: GET_PAIR_FAILURE,
  payload: error
});

/**
 * Redux Action Get Update Pair List
 */
export const getUpdatedPairList = () => /* (console.log('ACTION', 'getUpdatedPairList')),  */ ({
  type: UPDATE_PAIR
});

/**
 * Redux Action Get Update Pair List Success
 */
export const getUpdatedPairListSuccess = response => ({
  type: UPDATE_PAIR_SUCCESS,
  payload: response.data
});

/**
 * Redux Action Get Update Pair List Failure
 */
export const getUpdatedPairListFailure = error => ({
  type: UPDATE_PAIR_FAILURE,
  payload: error
});

/**
 * Redux Action Get Update Pair List
 */
export const addTask = newTask => /* (console.log('ACTION', 'getUpdatedPairList')),  */ ({
  type: ADD_TASK,
  payload: newTask
});

/**
 * Redux Action Get Update Pair List Success
 */
export const addTaskSuccess = response => ({
  type: ADD_TASK_SUCCESS,
  payload: response.data
});

/**
 * Redux Action Get Update Pair List Failure
 */
export const addTaskFailure = error => ({
  type: ADD_TASK_FAILURE,
  payload: error
});
/**
 * Redux Action Get Update Pair List
 */
export const getTask = () => /* (console.log('ACTION', 'getUpdatedPairList')),  */ ({
  type: GET_TASK
});

/**
 * Redux Action Get Update Pair List Success
 */
export const getTaskSuccess = response => ({
  type: GET_TASK_SUCCESS,
  payload: response.data
});

/**
 * Redux Action Get Update Pair List Failure
 */
export const getTaskFailure = error => ({
  type: GET_TASK_FAILURE,
  payload: error
});
