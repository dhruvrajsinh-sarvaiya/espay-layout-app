/**
 * Create By Sanjay 
 * Created Date 04/03/2019
 * Actions For Referral Invitation By Email And SMS
 */

import {
    SEND_REFERRAL_BY_EMAIL,
    SEND_REFERRAL_BY_EMAIL_SUCCESS,
    SEND_REFERRAL_BY_EMAIL_FAILURE,

    SEND_REFERRAL_BY_SMS,
    SEND_REFERRAL_BY_SMS_SUCCESS,
    SEND_REFERRAL_BY_SMS_FAILURE
} from '../types';

//Action For Send Referral Invitation By Email 
export const sendReferralInvitationByEmail = (request) =>({
    type: SEND_REFERRAL_BY_EMAIL,
    payload: request
})

export const sendReferralInvitationByEmailSuccess = (response) =>({
    type: SEND_REFERRAL_BY_EMAIL_SUCCESS,
    payload: response
})

export const sendReferralInvitationByEmailFailure = (error) =>({
    type: SEND_REFERRAL_BY_EMAIL_FAILURE,
    payload: error
})

//Action For Send Referral Invitation By SMS 
export const sendReferralInvitationBySMS = (request) =>({
    type: SEND_REFERRAL_BY_SMS,
    payload: request
})

export const sendReferralInvitationBySMSSuccess = (response) =>({
    type: SEND_REFERRAL_BY_SMS_SUCCESS,
    payload: response
})

export const sendReferralInvitationBySMSFailure = (error) =>({
    type: SEND_REFERRAL_BY_SMS_FAILURE,
    payload: error
})