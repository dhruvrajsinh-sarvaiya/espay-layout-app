/**
 * Created By Sanjay 
 * Created Date 21/02/2019
 * Actions For Referral Invitation 
 */

 import {
    GET_REFERRAL_INVITE_LIST,
    GET_REFERRAL_INVITE_LIST_SUCCESS,
    GET_REFERRAL_INVITE_LIST_FAILURE,

    GET_REFERRAL_INVITE_BY_CHANNEL,
    GET_REFERRAL_INVITE_BY_CHANNEL_SUCCESS,
    GET_REFERRAL_INVITE_BY_CHANNEL_FAILURE,

    GET_REFERRAL_PARTICIPATE_LIST,
    GET_REFERRAL_PARTICIPATE_LIST_SUCCESS,
    GET_REFERRAL_PARTICIPATE_LIST_FAILURE,

    CLICK_REFERRAL_LINK_REPORT,
    CLICK_REFERRAL_LINK_REPORT_SUCCESS,
    CLICK_REFERRAL_LINK_REPORT_FAILURE,

    REFERRAL_REWARD_REPORT,
    REFERRAL_REWARD_REPORT_SUCCESS,
    REFERRAL_REWARD_REPORT_FAILURE,

    GET_CHANNEL_TYPE,
    GET_CHANNEL_TYPE_SUCCESS,
    GET_CHANNEL_TYPE_FAILURE,

    GET_SERVICE_LIST,
    GET_SERVICE_LIST_SUCCESS,
    GET_SERVICE_LIST_FAILURE
 } from '../types';

 export const getReferralInviteList = (request) => ({
     type: GET_REFERRAL_INVITE_LIST,
     payload: request
 })

 export const getReferralInviteListSuccess = (responce) => ({
    type: GET_REFERRAL_INVITE_LIST_SUCCESS,
    payload: responce
})

export const getReferralInviteListFailure= (error) => ({
    type: GET_REFERRAL_INVITE_LIST_FAILURE,
    payload: error
})

export const getReferralInviteByChannel = (request) => ({
    type: GET_REFERRAL_INVITE_BY_CHANNEL,
    payload: request
})

export const getReferralInviteByChannelSuccess = (responce) => ({
   type: GET_REFERRAL_INVITE_BY_CHANNEL_SUCCESS,
   payload: responce
})

export const getReferralInviteByChannelFailure= (error) => ({
   type: GET_REFERRAL_INVITE_BY_CHANNEL_FAILURE,
   payload: error
})

export const getReferralParticipate = (request) => ({
    type: GET_REFERRAL_PARTICIPATE_LIST,
    payload: request
})

export const getReferralParticipateSuccess = (responce) => ({
   type: GET_REFERRAL_PARTICIPATE_LIST_SUCCESS,
   payload: responce
})

export const getReferralParticipateFailure= (error) => ({
   type: GET_REFERRAL_PARTICIPATE_LIST_FAILURE,
   payload: error
})

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

export const getChannelType = () => ({
   type: GET_CHANNEL_TYPE
})

export const getChannelTypeSuccess = (responce) => ({
  type: GET_CHANNEL_TYPE_SUCCESS,
  payload: responce
})

export const getChannelTypeFailure= (error) => ({
  type: GET_CHANNEL_TYPE_FAILURE,
  payload: error
})

export const getServiceList = (request) => ({
   type: GET_SERVICE_LIST,
   payload: request
})

export const getServiceListSuccess = (responce) => ({
  type: GET_SERVICE_LIST_SUCCESS,
  payload: responce
})

export const getServiceListFailure= (error) => ({
  type: GET_SERVICE_LIST_FAILURE,
  payload: error
})

