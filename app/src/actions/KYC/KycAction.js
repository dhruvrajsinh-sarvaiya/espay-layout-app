 import {
    // Personal Verification
    PERSONAL_VERIFICATION,
    PERSONAL_VERIFICATION_SUCCESS,
    PERSONAL_VERIFICATION_FAILURE
} from '../ActionTypes';


/**
 * Redux Action To Personal Verification
 */
export const personalVerification = (reqKYC) => ({
    type: PERSONAL_VERIFICATION,
    reqKYC: reqKYC
});

/**
 * Redux Action Personal Verification Success
 */
export const personalVerificationSuccess = (response) => ({
    type: PERSONAL_VERIFICATION_SUCCESS,
    payload: response
});

/**
 * Redux Action Personal Verification Failure
 */
export const personalVerificationFailure = (error) => ({
    type: PERSONAL_VERIFICATION_FAILURE,
    payload: error
});
