/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated By : Salim Deraiya (24-01-2019)
 * Personal Verification Actions
 */

 //Import action types form type.js
 import {
    //Add KYC Details
    PERSONAL_VERIFICATION,
    PERSONAL_VERIFICATION_SUCCESS,
    PERSONAL_VERIFICATION_FAILURE,

    //Get KYC Status
    GET_KYC_STATUS,
    GET_KYC_STATUS_SUCCESS,
    GET_KYC_STATUS_FAILURE,
} from '../types';


/**
 * Redux Action To Personal Verification
 */
export const personalVerification = (data) => ({
    type: PERSONAL_VERIFICATION,
    payload: data
});

/**
 * Redux Action Personal Verification Success
 */
export const personalVerificationSuccess = (data) => ({
    type: PERSONAL_VERIFICATION_SUCCESS,
    payload: data
});

/**
 * Redux Action Personal Verification Failure
 */
export const personalVerificationFailure = (error) => ({
    type: PERSONAL_VERIFICATION_FAILURE,
    payload: error
});

/**
 * Redux Action To Get KYC Status
 */
export const getKYCStatus = () => ({
    type: GET_KYC_STATUS
});

/**
 * Redux Action Get KYC Status Success
 */
export const getKYCStatusSuccess = (data) => ({
    type: GET_KYC_STATUS_SUCCESS,
    payload: data
});

/**
 * Redux Action Get KYC Status Failure
 */
export const getKYCStatusFailure = (error) => ({
    type: GET_KYC_STATUS_FAILURE,
    payload: error
});