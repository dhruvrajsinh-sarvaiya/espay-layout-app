import {
  //Get Profile By ID
  GET_PROFILE_BY_ID,
  GET_PROFILE_BY_ID_SUCCESS,
  GET_PROFILE_BY_ID_FAILURE,

} from "../ActionTypes";

/**
 * Redux Action To Get Profile By ID
 */
export const getProfileByID = () => ({
  type: GET_PROFILE_BY_ID,
});

/**
 * Redux Action To Get Profile By ID Success
 */
export const getProfileByIDSuccess = (response) => ({
  type: GET_PROFILE_BY_ID_SUCCESS,
  payload: response
});

/**
 * Redux Action To Get Profile By ID Failure
 */
export const getProfileByIDFailure = (error) => ({
  type: GET_PROFILE_BY_ID_FAILURE,
  payload: error
});
