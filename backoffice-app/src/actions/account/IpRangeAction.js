import {
  //List ip range
  IP_RANGE_LIST,
  IP_RANGE_LIST_SUCCESS,
  IP_RANGE_LIST_FAILURE,

  //Edit ip range
  IP_RANGE_UPDATE,
  IP_RANGE_UPDATE_SUCCESS,
  IP_RANGE_UPDATE_FAILURE,

  //Add ip range
  IP_RANGE_ADD,
  IP_RANGE_ADD_SUCCESS,
  IP_RANGE_ADD_FAILURE,

  //Delete ip range 
  IP_RANGE_DELETE,
  IP_RANGE_DELETE_SUCCESS,
  IP_RANGE_DELETE_FAILURE,

  //clear data 
  IP_RANGE_CLEAR,
} from '../ActionTypes';

/**
 * Redux Action To List ip range
 */
export const ipRangeList = (data) => ({
  type: IP_RANGE_LIST,
  payload: data
});
/**
 * Redux Action List ip range Success
 */
export const ipRangeListSuccess = list => ({
  type: IP_RANGE_LIST_SUCCESS,
  payload: list
});
/**
 * Redux Action List ip range Failure
 */
export const ipRangeListFailure = error => ({
  type: IP_RANGE_LIST_FAILURE,
  payload: error
});
/**
 * Redux Action To edit ip range
 */
export const updateIpRange = data => ({
  type: IP_RANGE_UPDATE,
  payload: data
});
/**
 * Redux Action Edit ip range Success
 */
export const updateIpRangeSuccess = data => ({
  type: IP_RANGE_UPDATE_SUCCESS,
  payload: data
});
/**
 * Redux Action Edit ip range Failure
 */
export const updateIpRangeFailure = error => ({
  type: IP_RANGE_UPDATE_FAILURE,
  payload: error
});
/**
 * Redux Action To Add ip range
 */
export const addIpRange = data => ({
  type: IP_RANGE_ADD,
  payload: data
});
/**
 * Redux Action Add ip range Success
 */
export const addIpRangeSuccess = data => ({
  type: IP_RANGE_ADD_SUCCESS,
  payload: data
});
/**
 * Redux Action Add ip range Failure
 */
export const addIpRangeFailure = error => ({
  type: IP_RANGE_ADD_FAILURE,
  payload: error
});
/**
 * Redux Action To Delete ip range
 */
export const deleteIpRange = (data) => ({
  type: IP_RANGE_DELETE,
  payload: data
});
/**
 * Redux Action Delete ip range Success
 */
export const deleteIpRangeSuccess = data => ({
  type: IP_RANGE_DELETE_SUCCESS,
  payload: data
});
/**
 * Redux Action Delete ip range Failure
 */
export const deleteIpRangeFailure = error => ({
  type: IP_RANGE_DELETE_FAILURE,
  payload: error
});
//for clear data

export const clearIpRange = () => ({
  type: IP_RANGE_CLEAR,
});

