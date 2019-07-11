/**
 * Create by Sanjay 
 * Created Date 06/03/2019
 * Action For Referral Report
 */

import {
    CLICK_REFERRAL_LINK_REPORT,
    CLICK_REFERRAL_LINK_REPORT_SUCCESS,
    CLICK_REFERRAL_LINK_REPORT_FAILURE,

    REFERRAL_REWARD_REPORT,
    REFERRAL_REWARD_REPORT_SUCCESS,
    REFERRAL_REWARD_REPORT_FAILURE,

    GET_REFERRAL_SERVICE,
    GET_REFERRAL_SERVICE_SUCCESS,
    GET_REFERRAL_SERVICE_FAILURE
 } from '../types';

export const clickReferralLinkReport = (request) => ({
   type: CLICK_REFERRAL_LINK_REPORT,
   payload: request
})

export const clickReferralLinkReportSuccess = (responce) => ({
  type: CLICK_REFERRAL_LINK_REPORT_SUCCESS,
  payload: responce
})

export const clickReferralLinkReportFailure= (error) => ({
  type: CLICK_REFERRAL_LINK_REPORT_FAILURE,
  payload: error
})

export const referralRewardReport = (request) => ({
   type: REFERRAL_REWARD_REPORT,
   payload: request
})

export const referralRewardReportSuccess = (responce) => ({
  type: REFERRAL_REWARD_REPORT_SUCCESS,
  payload: responce
})

export const referralRewardReportFailure= (error) => ({
  type: REFERRAL_REWARD_REPORT_FAILURE,
  payload: error
})

export const getReferralService = () => ({
  type: GET_REFERRAL_SERVICE
})

export const getReferralServiceSuccess = (responce) => ({
 type: GET_REFERRAL_SERVICE_SUCCESS,
 payload: responce
})

export const getReferralServiceFailure= (error) => ({
 type: GET_REFERRAL_SERVICE_FAILURE,
 payload: error
})

