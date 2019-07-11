/**
 * Auther : Salim Deraiya
 * Created : 03/10/2018
 * SLA Configuration Actions
 */

//Import action types form type.js
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
} from "../types";

/**
 * Redux Action To List SLA Configuration
 */
export const slaConfigurationList = data => ({
  type: LIST_SLA,
  payload: data
});

/**
 * Redux Action List SLA Configuration Success
 */
export const slaConfigurationListSuccess = list => ({
  type: LIST_SLA_SUCCESS,
  payload: list
});

/**
 * Redux Action List SLA Configuration Failure
 */
export const slaConfigurationListFailure = error => ({
  type: LIST_SLA_FAILURE,
  payload: error
});

/**
 * Redux Action To Edit SLA Configuration
 */
export const editSLAConfiguration = data => ({
  type: EDIT_SLA,
  payload: data
});

/**
 * Redux Action Edit SLA Configuration Success
 */
export const editSLAConfigurationSuccess = data => ({
  type: EDIT_SLA_SUCCESS,
  payload: data
});

/**
 * Redux Action Edit SLA Configuration Failure
 */
export const editSLAConfigurationFailure = error => ({
  type: EDIT_SLA_FAILURE,
  payload: error
});

/**
 * Redux Action To Add SLA Configuration
 */
export const addSLAConfiguration = data => ({
  type: ADD_SLA,
  payload: data
});

/**
 * Redux Action Add SLA Configuration Success
 */
export const addSLAConfigurationSuccess = data => ({
  type: ADD_SLA_SUCCESS,
  payload: data
});

/**
 * Redux Action Add SLA Configuration Failure
 */
export const addSLAConfigurationFailure = error => ({
  type: ADD_SLA_FAILURE,
  payload: error
});

/**
 * Redux Action To Delet SLA Configuration
 */
export const deleteSLAConfiguration = id => ({
  type: DELETE_SLA,
  payload: id
});

/**
 * Redux Action Delet SLA Configuration Success
 */
export const deleteSLAConfigurationSuccess = data => ({
  type: DELETE_SLA_SUCCESS,
  payload: data
});

/**
 * Redux Action Delet SLA Configuration Failure
 */
export const deleteSLAConfigurationFailure = error => ({
  type: DELETE_SLA_FAILURE,
  payload: error
});