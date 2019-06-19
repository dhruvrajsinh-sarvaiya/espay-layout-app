/**
 * Anti-Phishing Code Actions (code added by Parth Jani 21-9-2018)
 */
import {
  ANTI_PHISHING_CODE,
  ANTI_PHISHING_CODE_SUCCESS,
  ANTI_PHISHING_CODE_FAILURE
} from "../types";

/**
 * Redux Action To Anti-Phishing Code
 */
export const getAntiPhishingCode = user => ({
  type: ANTI_PHISHING_CODE,
  payload: user
});

/**
 * Redux Action To Anti-Phishing Code Success
 */
export const getAntiPhishingCodeSuccess = user => ({
  type: ANTI_PHISHING_CODE_SUCCESS,
  payload: user
});

/**
 * Redux Action To Anti-Phishing Code Failure
 */
export const getAntiPhishingCodeFailure = error => ({
  type: ANTI_PHISHING_CODE_FAILURE,
  payload: error
});
