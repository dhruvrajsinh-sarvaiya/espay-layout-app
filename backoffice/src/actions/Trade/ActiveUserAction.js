// Actions For Active Users Data By Tejas

// import types
import {
  GET_ACTIVE_USER_DATA,
  GET_ACTIVE_USER_DATA_SUCCESS,
  GET_ACTIVE_USER_DATA_FAILURE
} from "Actions/types";

//action for ge Active Users and set type for reducers
export const getActiveUserData = Pair => ({
  type: GET_ACTIVE_USER_DATA,
  payload: { Pair }
});

//action for set Success and Active Users and set type for reducers
export const getActiveUserSuccess = response => ({
  type: GET_ACTIVE_USER_DATA_SUCCESS,
  payload: response.data
});

//action for set failure and error to Active Users and set type for reducers
export const getActiveUserFailure = error => ({
  type: GET_ACTIVE_USER_DATA_FAILURE,
  payload: error
});
