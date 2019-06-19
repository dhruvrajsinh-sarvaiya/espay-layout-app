/**
 * Auther : Salim Deraiya
 * Created : 24/12/2018
 * Social Trading Policy Actions
 */

import {
    //Get Social Trading Policy
    GET_SOCIAL_TRADING_POLICY,
    GET_SOCIAL_TRADING_POLICY_SUCCESS,
    GET_SOCIAL_TRADING_POLICY_FAILURE
} from '../types';

/**
 * Redux Action To Get Social Trading Policy  Configuration
 */
export const getSocialTradingPolicy = () => ({
    type: GET_SOCIAL_TRADING_POLICY
});

/**
 * Redux Action Get Social Trading Policy Config Success
 */
export const getSocialTradingPolicySuccess = (data) => ({
    type: GET_SOCIAL_TRADING_POLICY_SUCCESS,
    payload: data
});

/**
 * Redux Action Get Social Trading Policy Config Failure
 */
export const getSocialTradingPolicyFailure = (error) => ({
    type: GET_SOCIAL_TRADING_POLICY_FAILURE,
    payload: error
});