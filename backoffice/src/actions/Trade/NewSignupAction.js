// Actions For New SignUp Data By Tejas

// import types
import {
  GET_NEW_SIGNUP_DATA,
  GET_NEW_SIGNUP_DATA_SUCCESS,
  GET_NEW_SIGNUP_DATA_FAILURE
} from "Actions/types";

//action for ge New SignUp and set type for reducers
export const getNewSignupData = Pair => ({
  type: GET_NEW_SIGNUP_DATA,
  payload: { Pair }
});

//action for set Success and New SignUp and set type for reducers
export const getNewSignupSuccess = response => ({
  type: GET_NEW_SIGNUP_DATA_SUCCESS,
  payload: response.data
});

//action for set failure and error to New SignUp and set type for reducers
export const getNewSignupFailure = error => ({
  type: GET_NEW_SIGNUP_DATA_FAILURE,
  payload: error
});
