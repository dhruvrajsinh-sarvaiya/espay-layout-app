/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Enterprise Verification Actions
 */

 //Import action types form type.js
 import {
    ENTERPRISE_VERIFICATION,
    ENTERPRISE_VERIFICATION_SUCCESS,
    ENTERPRISE_VERIFICATION_FAILURE
} from '../types';

/**
 * Redux Action To Enterprise Verification
 */
export const enterpriseVerification = (data) => ({
    type: ENTERPRISE_VERIFICATION,
    payload: data
});

/**
 * Redux Action Enterprise Verification Success
 */
export const enterpriseVerificationSuccess = (data) => ({
    type: ENTERPRISE_VERIFICATION_SUCCESS,
    payload: data
});

/**
 * Redux Action Enterprise Verification Failure
 */
export const enterpriseVerificationFailure = (error) => ({
    type: ENTERPRISE_VERIFICATION_FAILURE,
    payload: error
});
