/**
 * Profile Actions
 */
import {
  //For Profiles
  PROFILES,
  PROFILES_SUCCESS,
  PROFILES_FAILURE,

  //For Create Profile
  CREATE_PROFILES,
  CREATE_PROFILES_SUCCESS,
  CREATE_PROFILES_FAILURE,

  //For Display Users Profile
  USERS_PROFILE,
  USERS_PROFILE_SUCCESS,
  USERS_PROFILE_FAILURE,

  //For Create Profile
  UPDATE_PROFILES,
  UPDATE_PROFILES_SUCCESS,
  UPDATE_PROFILES_FAILURE,

  //For Delete Profile
  DELETE_PROFILES,
  DELETE_PROFILES_SUCCESS,
  DELETE_PROFILES_FAILURE,

  //For Delete Profile
  UPDATE_PROFILES_PERMISSIONS,
  UPDATE_PROFILES_PERMISSIONS_SUCCESS,
  UPDATE_PROFILES_PERMISSIONS_FAILURE
} from "../types";

//For Profiles
/**
 * Redux Action To Profiles
 */
export const displayProfiles = () => ({
  type: PROFILES
});

/**
 * Redux Action To Profiles Success
 */
export const displayProfilesSuccess = response => ({
  type: PROFILES_SUCCESS,
  payload: response
});

/**
 * Redux Action To Profiles Failure
 */
export const displayProfilesFailure = error => ({
  type: PROFILES_FAILURE,
  payload: error
});

//For Create Profiles
/**
 * Redux Action To Create Profile
 */
export const createProfile = user => ({
  type: CREATE_PROFILES,
  payload: user
});

/**
 * Redux Action To Create Profile Success
 */
export const createProfileSuccess = response => ({
  type: CREATE_PROFILES_SUCCESS,
  payload: response.data
});

/**
 * Redux Action To Create Profile Failure
 */
export const createProfileFailure = error => ({
  type: CREATE_PROFILES_FAILURE,
  payload: error
});

//For Users Profile
/**
 * Redux Action To Users Profile
 */
export const displayUsersProfile = () => ({
  type: USERS_PROFILE
});

/**
 * Redux Action To Users Profile Success
 */
export const displayUsersProfileSuccess = response => ({
  type: USERS_PROFILE_SUCCESS,
  payload: response
});

/**
 * Redux Action To Users Profile Failure
 */
export const displayUsersProfileFailure = error => ({
  type: USERS_PROFILE_FAILURE,
  payload: error
});

//For Update Profiles
/**
 * Redux Action To Update Profile
 */
export const updateProfile = user => ({
  type: UPDATE_PROFILES,
  payload: user
});

/**
 * Redux Action To Update Profile Success
 */
export const updateProfileSuccess = response => ({
  type: UPDATE_PROFILES_SUCCESS,
  payload: response
});

/**
 * Redux Action To Update Profile Failure
 */
export const updateProfileFailure = error => ({
  type: UPDATE_PROFILES_FAILURE,
  payload: error
});

//For Delete Profiles
/**
 * Redux Action To Delete Profile
 */
export const deleteProfile = user => ({
  type: DELETE_PROFILES,
  payload: user
});

/**
 * Redux Action To Delete Profile Success
 */
export const deleteProfileSuccess = response => ({
  type: DELETE_PROFILES_SUCCESS,
  payload: response
});

/**
 * Redux Action To Delete Profile Failure
 */
export const deleteProfileFailure = error => ({
  type: DELETE_PROFILES_FAILURE,
  payload: error
});

//For Delete Profiles Permissions
/**
 * Redux Action To Delete Profile Permissions
 */
export const updateProfilePermissions = user => ({
  type: UPDATE_PROFILES_PERMISSIONS,
  payload: user
});

/**
 * Redux Action To Delete Profile Permissions Success
 */
export const updateProfilePermissionsSuccess = response => ({
  type: UPDATE_PROFILES_PERMISSIONS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Delete Profile Permissions Failure
 */
export const updateProfilePermissionsFailure = error => ({
  type: UPDATE_PROFILES_PERMISSIONS_FAILURE,
  payload: error
});
