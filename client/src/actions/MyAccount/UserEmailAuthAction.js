/**
 * Auth Actions
 */
import {

  //For Signup with Email
  SIGNUP_USERS,
  SIGNUP_USERS_SUCCESS,
  SIGNUP_USERS_FAILURE,

} from "../types";


//For Signup User with Email.
/**
 * Redux Action To Signup User with Email
 */
export const signupUser = (user) => ({
  type: SIGNUP_USERS,
  payload: { user }
});

/**
 * Redux Action To Signup User Success with Email
 */
export const signUpUserSuccess = (user) => ({
  type: SIGNUP_USERS_SUCCESS,
  payload: user
});

/**
 * Redux Action To Signup User Failure with Email
 */
export const signUpUserFailure = (error) => ({
  type: SIGNUP_USERS_FAILURE,
  payload: error
});


