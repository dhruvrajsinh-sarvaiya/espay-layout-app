/**
 * Auther : Kevin Ladani
 * Created : 12/10/2018
 * Updated : 23/10/2018 (Salim Deraiya)
 * Disable Google Auth Widget
 */

import {
  DISABLE_GOOGLE_AUTH,
  DISABLE_GOOGLE_AUTH_SUCCESS,
  DISABLE_GOOGLE_AUTH_FAILURE
} from "../types";

//For Submit Send SMS Auth.
/**
 * Redux Action To Submit Send SMS Auth
 */
export const disableGoogleauth = (data) => ({
  type: DISABLE_GOOGLE_AUTH,
  payload: data
});

/**
 * Redux Action To Submit Send SMS Auth Success
 */
export const disableGoogleauthSuccess = (data) => ({
  type: DISABLE_GOOGLE_AUTH_SUCCESS,
  payload: data
});

/**
 * Redux Action To Submit Send SMS Auth Failure
 */
export const disableGoogleauthFailure = (error) => ({
  type: DISABLE_GOOGLE_AUTH_FAILURE,
  payload: error
}); 