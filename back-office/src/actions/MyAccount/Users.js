/**
 * Display Users Actions
 */
import {
  //For Display Users
  DISPALY_USERS,
  DISPALY_USERS_SUCCESS,
  DISPALY_USERS_FAILURE,

  //For Add Users
  ADD_USERS,
  ADD_USERS_SUCCESS,
  ADD_USERS_FAILURE,

  //For Delete Users
  DELETE_USERS,
  DELETE_USERS_SUCCESS,
  DELETE_USERS_FAILURE,

  //For Edit Users
  EDIT_USERS,
  EDIT_USERS_SUCCESS,
  EDIT_USERS_FAILURE
} from "../types";

//For Display Users
/**
 * Redux Action To Display Users
 */

export const displayUsers = () => ({
  type: DISPALY_USERS
});

/**
 * Redux Action To Display Users Success
 */
export const displayUsersSuccess = response => ({
  type: DISPALY_USERS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Display Users Failure
 */
export const displayUsersFailure = error => ({
  type: DISPALY_USERS_FAILURE,
  payload: error
});

//For Delete Users
/**
 * Redux Action To Delete Users
 */
export const deleteUsers = user => ({
  type: DELETE_USERS,
  payload: user
});

/**
 * Redux Action To Delete Users Success
 */
export const deleteUsersSuccess = data => ({
  type: DELETE_USERS_SUCCESS,
  payload: data
});

/**
 * Redux Action To Delete Users Failure
 */
export const deleteUsersFailure = error => ({
  type: DELETE_USERS_FAILURE,
  payload: error
});

//For Add Users
/**
 * Redux Action To Add Users
 */
export const addUsers = user => ({
  type: ADD_USERS,
  payload: user
});

/**
 * Redux Action To Add Users Success
 */
export const addUsersSuccess = response => ({
  type: ADD_USERS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Add Users Failure
 */
export const addUsersFailure = error => ({
  type: ADD_USERS_FAILURE,
  payload: error
});

//For Edit Users
/**
 * Redux Action To Edit Users
 */

export const editUsers = user => ({
  type: EDIT_USERS,
  payload: user
});

/**
 * Redux Action To Edit Users Success
 */
export const editUsersSuccess = response => ({
  type: EDIT_USERS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Edit Users Failure
 */
export const editUsersFailure = error => ({
  type: EDIT_USERS_FAILURE,
  payload: error
});
