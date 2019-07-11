/**
 * Forgot Password Actions
 */
import {
  //For Reset Password
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE
} from "../types";

//For Forgot Password
/**
 * Redux Action To Forgot Password
 */
export const forgotPassword = user => ({
  type: FORGOT_PASSWORD,
  payload: user
});

/**
 * Redux Action To Forgot Password Success
 */
export const forgotPasswordSuccess = user => ({
  type: FORGOT_PASSWORD_SUCCESS,
  payload: user
});

/**
 * Redux Action To Forgot Password Failure
 */
export const forgotPasswordFailure = error => ({
  type: FORGOT_PASSWORD_FAILURE,
  payload: error
});
