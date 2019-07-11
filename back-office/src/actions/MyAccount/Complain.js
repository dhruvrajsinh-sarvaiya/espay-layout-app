/**
 * Auther : Salim Deraiya
 * Created : 03/10/2018
 * Complain Actions
 */

//Import action types form type.js
import {
  //Count Total Complain
  HELPNSUPPORT_DASHBOARD,
  HELPNSUPPORT_DASHBOARD_SUCCESS,
  HELPNSUPPORT_DASHBOARD_FAILURE,

  //List Complain
  LIST_COMPLAIN,
  LIST_COMPLAIN_SUCCESS,
  LIST_COMPLAIN_FAILURE,

  //Edit Complain
  EDIT_COMPLAIN,
  EDIT_COMPLAIN_SUCCESS,
  EDIT_COMPLAIN_FAILURE,

  //Get Complain
  GET_COMPLAIN_BY_ID,
  GET_COMPLAIN_BY_ID_SUCCESS,
  GET_COMPLAIN_BY_ID_FAILURE,

  //Replay Complain
  REPLAY_COMPLAIN,
  REPLAY_COMPLAIN_SUCCESS,
  REPLAY_COMPLAIN_FAILURE,

  //Get Complain Conversion
  GET_COMPLAIN_CONVERSION_BY_ID,
  GET_COMPLAIN_CONVERSION_BY_ID_SUCCESS,
  GET_COMPLAIN_CONVERSION_BY_ID_FAILURE,

  //List SLA
  GET_SLA_LIST,
  GET_SLA_LIST_SUCCESS,
  GET_SLA_LIST_FAILURE,
} from "../types";

//For Display Help & Support Data
/* Redux Action To Display Help & Support Data */
export const getHelpNSupportData = () => ({
  type: HELPNSUPPORT_DASHBOARD
});

/* Redux Action To Display Help & Support Success */
export const getHelpNSupportDataSuccess = (response) => ({
  type: HELPNSUPPORT_DASHBOARD_SUCCESS,
  payload: response
});

/* Redux Action To Display Help & Support Data Failure */
export const getHelpNSupportDataFailure = (error) => ({
  type: HELPNSUPPORT_DASHBOARD_FAILURE,
  payload: error
});


/**
 * Redux Action To List Complain
 */
export const complainList = data => ({
  type: LIST_COMPLAIN,
  payload: data
});

/**
 * Redux Action List Complain Success
 */
export const complainListSuccess = list => ({
  type: LIST_COMPLAIN_SUCCESS,
  payload: list
});

/**
 * Redux Action List Complain Failure
 */
export const complainListFailure = error => ({
  type: LIST_COMPLAIN_FAILURE,
  payload: error
});

/**
 * Redux Action To Edit Complain
 */
export const editComplain = data => ({
  type: EDIT_COMPLAIN,
  payload: data
});

/**
 * Redux Action Edit Complain Success
 */
export const editComplainSuccess = data => ({
  type: EDIT_COMPLAIN_SUCCESS,
  payload: data
});

/**
 * Redux Action Edit Complain Failure
 */
export const editComplainFailure = error => ({
  type: EDIT_COMPLAIN_FAILURE,
  payload: error
});

/**
 * Redux Action To Get Complain By Id
 */
export const getComplainById = id => ({
  type: GET_COMPLAIN_BY_ID,
  payload: id
});

/**
 * Redux Action Get Complain By Id Success
 */
export const getComplainByIdSuccess = data => ({
  type: GET_COMPLAIN_BY_ID_SUCCESS,
  payload: data
});

/**
 * Redux Action Get Complain By Id Failure
 */
export const getComplainByIdFailure = error => ({
  type: GET_COMPLAIN_BY_ID_FAILURE,
  payload: error
});

/**
 * Redux Action To Replay Complain
 */
export const replayComplain = data => ({
  type: REPLAY_COMPLAIN,
  payload: data
});

/**
 * Redux Action Replay Complain Success
 */
export const replayComplainSuccess = data => ({
  type: REPLAY_COMPLAIN_SUCCESS,
  payload: data
});

/**
 * Redux Action Replay Complain Failure
 */
export const replayComplainFailure = error => ({
  type: REPLAY_COMPLAIN_FAILURE,
  payload: error
});

/**
 * Redux Action To Get Complain Conversion By Id
 */
export const getComplainConversionById = id => ({
  type: GET_COMPLAIN_CONVERSION_BY_ID,
  payload: id
});

/**
 * Redux Action Get Complain Conversion By Id Success
 */
export const getComplainConversionByIdSuccess = data => ({
  type: GET_COMPLAIN_CONVERSION_BY_ID_SUCCESS,
  payload: data
});

/**
 * Redux Action Get Complain Conversion By Id Failure
 */
export const getComplainConversionByIdFailure = error => ({
  type: GET_COMPLAIN_CONVERSION_BY_ID_FAILURE,
  payload: error
});

//For Display Help & Support Data
/* Redux Action To Display Help & Support Data */
export const getSLAList = data => ({
  type: GET_SLA_LIST,
  payload: data
});

/* Redux Action To Display Help & Support Success */
export const getSLAListSuccess = (response) => ({
  type: GET_SLA_LIST_SUCCESS,
  payload: response
});

/* Redux Action To Display Help & Support Data Failure */
export const getSLAListFailure = (error) => ({
  type: GET_SLA_LIST_FAILURE,
  payload: error
});

