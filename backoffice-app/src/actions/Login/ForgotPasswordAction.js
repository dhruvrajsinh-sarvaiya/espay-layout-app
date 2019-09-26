import {
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux Action Forgot Password Success
export function forgotPasswordSuccess(data) {
  return action(FORGOT_PASSWORD_SUCCESS, { payload: data });
}

// Redux Action Forgot Password Failure
export function forgotPasswordFailure(error) {
  return action(FORGOT_PASSWORD_FAILURE, { payload: error });
}

// Redux Action To Forgot Password
export function forgotPassword(data) {
  return action(FORGOT_PASSWORD, { payload: data });
}