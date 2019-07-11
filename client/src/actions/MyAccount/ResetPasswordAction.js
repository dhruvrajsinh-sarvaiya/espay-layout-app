/**
 * Auther : Kevin Ladani
 * Updated By : Salim Deraiya
 * Created : 16/10/2018
 * Reset Password Actions
 */

import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE
} from "../types";

/**
 * Redux Action To Reset Password
 */
export const resetPassword = (user) => ({
  type: RESET_PASSWORD,
  payload: user
});

/**
 * Redux Action To Reset Password Success
 */
export const resetPasswordSuccess = (user) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: user
});

/**
 * Redux Action To Reset Password Failure
 */
export const resetPasswordFailure = (error) => ({
  type: RESET_PASSWORD_FAILURE,
  payload: error
});