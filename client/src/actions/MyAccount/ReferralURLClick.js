/**
 * Create By Sanjay
 * Created Date 06/03/2019
 * Action For Referral URL Click
 */

import {
    REFERRAL_URL_CLICK,
    REFERRAL_URL_CLICK_SUCCESS,
    REFERRAL_URL_CLICK_FAILURE
} from '../types';

/**
 * Action Get Referral Code From URL  
 */
export const referralUrlClick = (request) => ({
    type: REFERRAL_URL_CLICK,
    payload: request
});

export const referralUrlClickSuccess = (response) => ({
    type: REFERRAL_URL_CLICK_SUCCESS,
    payload: response
});

export const referralUrlClickFailure = (error) => ({
    type: REFERRAL_URL_CLICK_FAILURE,
    payload: error
});