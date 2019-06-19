/* 
    Developer : Nishant Vadgama
    Date : 27-09-2018
    FIle Comment : Fee & Limits Pattern Actions
*/
import {
  GET_PATTERNLIST,
  GET_PATTERNLIST_SUCCESS,
  GET_PATTERNLIST_FAILURE,
  DELETE_PATTERN,
  DELETE_PATTERN_SUCCESS,
  DELETE_PATTERN_FAILURE,
  GET_PATTERNINFO,
  GET_PATTERNINFO_SUCCESS,
  GET_PATTERNINFO_FAILURE,
  POST_PATTERNINFO,
  POST_PATTERNINFO_SUCCESS,
  POST_PATTERNINFO_FAILURE,
  GET_PATTERNBYID,
  GET_PATTERNBYID_SUCCESS,
  GET_PATTERNBYID_FAILURE
} from "../types";

// get existing pattern list
export const getPatternList = () => ({
  type: GET_PATTERNLIST
});
// get pattern list success
export const getPatternListSuccess = response => ({
  type: GET_PATTERNLIST_SUCCESS,
  payload: response.data
});
// get pattern list failure
export const getPatternListFailure = error => ({
  type: GET_PATTERNLIST_FAILURE,
  payload: error
});

// delete pattern from list
export const deletePattern = patternId => ({
  type: DELETE_PATTERN,
  payload: patternId
});
// delete pattern from list success
export const deletePatterSuccess = response => ({
  type: DELETE_PATTERN_SUCCESS,
  payload: response.data
});
// delete pattern from list failure
export const deletePatterFailure = error => ({
  type: DELETE_PATTERN_FAILURE,
  payload: error
});

// get pattern basic needed details for add new pattern
export const getPatternInfo = () => ({
  type: GET_PATTERNINFO
});
//get pattern basic needed details for add new pattern success
export const getPatternInfoSuccess = response => ({
  type: GET_PATTERNINFO_SUCCESS,
  payload: response.data
});
//get pattern basic needed details for add new pattern failure
export const getPatternInfoFailure = error => ({
  type: GET_PATTERNINFO_FAILURE,
  payload: error
});

// add new patter post data form
export const postPatternInfo = payload => ({
  type: POST_PATTERNINFO,
  payload: payload
});
// add new patter post data form success
export const postPatternInfoSuccess = response => ({
  type: POST_PATTERNINFO_SUCCESS,
  payload: response.data
});
// add new patter post data form failure
export const postPatternInfoFailure = error => ({
  type: POST_PATTERNINFO_FAILURE,
  payload: error
});

/* On EDit get pattern details by ID */
export const getPatternById = patternId => ({
  type: GET_PATTERNBYID,
  payload: patternId
});
// get pattern details success
export const getPatternByIdSuccess = response => ({
  type: GET_PATTERNBYID_SUCCESS,
  payload: response.data
});
// get pattern details failure
export const getPatternByIdFailure = error => ({
  type: GET_PATTERNBYID_FAILURE,
  payload: error
});
