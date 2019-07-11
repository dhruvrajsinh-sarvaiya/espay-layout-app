/**
 * Create Profile Reducer
 */
import {
  //For Display Profile
  PROFILES,
  PROFILES_SUCCESS,
  PROFILES_FAILURE,

  //For Create Profile
  CREATE_PROFILES,
  CREATE_PROFILES_SUCCESS,
  CREATE_PROFILES_FAILURE,

  //For Users Profile
  USERS_PROFILE,
  USERS_PROFILE_SUCCESS,
  USERS_PROFILE_FAILURE,

  //For Create Profile
  UPDATE_PROFILES,
  UPDATE_PROFILES_SUCCESS,
  UPDATE_PROFILES_FAILURE,

  //For Create Profile
  DELETE_PROFILES,
  DELETE_PROFILES_SUCCESS,
  DELETE_PROFILES_FAILURE,

  //For Delete Profile
  UPDATE_PROFILES_PERMISSIONS,
  UPDATE_PROFILES_PERMISSIONS_SUCCESS,
  UPDATE_PROFILES_PERMISSIONS_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
  profilesdata: [],
  userprofilesdata: [],
  loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INIT_STATE
  }
  switch (action.type) {
    //For Display Profiles
    case PROFILES:
    case CREATE_PROFILES:
    case USERS_PROFILE:
    case UPDATE_PROFILES:
    case DELETE_PROFILES:
    case UPDATE_PROFILES_PERMISSIONS:
      return { ...state, loading: true };

    case PROFILES_SUCCESS:
      return { ...state, loading: false, profilesdata: action.payload };

    case PROFILES_FAILURE:
    case CREATE_PROFILES_FAILURE:
    case USERS_PROFILE_FAILURE:
    case UPDATE_PROFILES_FAILURE:
    case DELETE_PROFILES_FAILURE:
    case UPDATE_PROFILES_PERMISSIONS_FAILURE:
      return { ...state, loading: false };

    case CREATE_PROFILES_SUCCESS:
    case UPDATE_PROFILES_SUCCESS:
    case DELETE_PROFILES_SUCCESS:
    case UPDATE_PROFILES_PERMISSIONS_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case USERS_PROFILE_SUCCESS:
      return { ...state, loading: false, userprofilesdata: action.payload };
    
    default:
      return { ...state };
  }
};
