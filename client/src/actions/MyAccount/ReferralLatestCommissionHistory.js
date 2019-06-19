/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Referral Latest Commission History Actions
 */

 //Import action types form type.js
 import {
    REFERRAL_LATEST_COMMISSION_HISTORY_LIST, 
    REFERRAL_LATEST_COMMISSION_HISTORY_SUCCESS, 
    REFERRAL_LATEST_COMMISSION_HISTORY_FAILURE
} from '../types';

/**
 * Redux Action Referral Latest Commission History Success
 */
export const referralLatestCommissionHistorySuccess = (list) => ({
    type: REFERRAL_LATEST_COMMISSION_HISTORY_SUCCESS,
    payload: list
});

/**
 * Redux Action Referral Latest Commission History Failure
 */
export const referralLatestCommissionHistoryFailure = (error) => ({
    type: REFERRAL_LATEST_COMMISSION_HISTORY_FAILURE,
    payload: error
})

/**
 * Redux Action To Referral Latest Commission History
 */
export const referralLatestCommissionHistory = () => ({
    type: REFERRAL_LATEST_COMMISSION_HISTORY_LIST
})
