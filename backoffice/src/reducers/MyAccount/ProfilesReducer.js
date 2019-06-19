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

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    //For Display Profiles
    case PROFILES:
      return { ...state, loading: true };

    case PROFILES_SUCCESS:
      return { ...state, loading: false, profilesdata: action.payload };

    case PROFILES_FAILURE:
      return { ...state, loading: false };

    //For Create Profiles
    case CREATE_PROFILES:
      return { ...state, loading: true };

    case CREATE_PROFILES_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case CREATE_PROFILES_FAILURE:
      return { ...state, loading: false };

    //For Display Users Profile
    case USERS_PROFILE:
      return { ...state, loading: true };

    case USERS_PROFILE_SUCCESS:
      return { ...state, loading: false, userprofilesdata: action.payload };

    case USERS_PROFILE_FAILURE:
      return { ...state, loading: false };

    //For Update Profiles
    case UPDATE_PROFILES:
      return { ...state, loading: true };

    case UPDATE_PROFILES_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case UPDATE_PROFILES_FAILURE:
      return { ...state, loading: false };

    //For Delete Profiles
    case DELETE_PROFILES:
      return { ...state, loading: true };

    case DELETE_PROFILES_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case DELETE_PROFILES_FAILURE:
      return { ...state, loading: false };

    //For Update Profiles Permissions
    case UPDATE_PROFILES_PERMISSIONS:
      return { ...state, loading: true };

    case UPDATE_PROFILES_PERMISSIONS_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case UPDATE_PROFILES_PERMISSIONS_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
