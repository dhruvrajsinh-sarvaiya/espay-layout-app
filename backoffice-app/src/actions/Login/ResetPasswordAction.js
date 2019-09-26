import {CHANGEPASSWORD_FETCH} from '../ActionTypes'
import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE
} from "../ActionTypes";

export function onChangePassword() {
  return {
   type : CHANGEPASSWORD_FETCH,
  }
}

/**
 * Redux Action To Change Password
 */
export const changePassword = (data) => ({
  type: CHANGE_PASSWORD,
  payload: data
});

/**
 * Redux Action To Change Password Success
 */
export const changePasswordSuccess = (data) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload: data
});

/**
 * Redux Action To Change Password Failure
 */
export const changePasswordFailure = (error) => ({
  type: CHANGE_PASSWORD_FAILURE,
  payload: error
});