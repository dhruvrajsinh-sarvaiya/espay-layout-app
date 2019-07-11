/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * User Profile Details Actions
 */

import {
  //Edit Profile
  EDIT_PROFILE,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_FAILURE,

  //Get Profile By ID
  GET_PROFILE_BY_ID,
  GET_PROFILE_BY_ID_SUCCESS,
  GET_PROFILE_BY_ID_FAILURE
} from "../types";

/**
 * Redux Action To Edit Profile
 */
export const editProfile = (data) => ({
  type: EDIT_PROFILE,
  payload: data
});

/**
 * Redux Action To Edit Profile Success
 */
export const editProfileSuccess = (user) => ({
  type: EDIT_PROFILE_SUCCESS,
  payload: user
});

/**
 * Redux Action To Edit Profile Failure
 */
export const editProfileFailure = (error) => ({
  type: EDIT_PROFILE_FAILURE,
  payload: error
});

/**
 * Redux Action To Get Profile By ID
 */
export const getProfileByID = () => ({
  type: GET_PROFILE_BY_ID
});

/**
 * Redux Action To Get Profile By ID Success
 */
export const getProfileByIDSuccess = (data) => ({
  type: GET_PROFILE_BY_ID_SUCCESS,
  payload: data
});

/**
 * Redux Action To Get Profile By ID Failure
 */
export const getProfileByIDFailure = (error) => ({
  type: GET_PROFILE_BY_ID_FAILURE,
  payload: error
});