import {
  DISABLE_GOOGLE_AUTH,
  DISABLE_GOOGLE_AUTH_SUCCESS,
  DISABLE_GOOGLE_AUTH_FAILURE
} from "../ActionTypes";

//For Submit Send SMS Auth.
/**
 * Redux Action To Submit Send SMS Auth
 */
export const disableGoogleauth = (disableGoogleAuthRequest) => ({
  type: DISABLE_GOOGLE_AUTH,
  disableGoogleAuthRequest: disableGoogleAuthRequest,
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