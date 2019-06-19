/**
 * Create By Sanjay 
 * Created Date 25/02/2019
 * Action For Referral Program 
 */

import {
    GET_REFERRAL_CODE,
    GET_REFERRAL_CODE_SUCCESS,
    GET_REFERRAL_CODE_FAILURE,

    GET_REFERRAL_URL,
    GET_REFERRAL_URL_SUCCESS,
    GET_REFERRAL_URL_FAILURE,

    GET_COUNT_REFERRAL_DASHBOARD,
    GET_COUNT_REFERRAL_DASHBOARD_SUCCESS,
    GET_COUNT_REFERRAL_DASHBOARD_FAILURE,

    GET_REFERRAL_INVITE_LIST,
    GET_REFERRAL_INVITE_LIST_SUCCESS,
    GET_REFERRAL_INVITE_LIST_FAILURE,

    GET_CHANNEL_TYPE,
    GET_CHANNEL_TYPE_SUCCESS,
    GET_CHANNEL_TYPE_FAILURE,

    GET_SERVICE_LIST,
    GET_SERVICE_LIST_SUCCESS,
    GET_SERVICE_LIST_FAILURE,

    GET_PAY_TYPE,
    GET_PAY_TYPE_SUCCESS,
    GET_PAY_TYPE_FAILURE,

    GET_REFERRAL_PARTICIPATE_LIST,
    GET_REFERRAL_PARTICIPATE_LIST_SUCCESS,
    GET_REFERRAL_PARTICIPATE_LIST_FAILURE,

    GET_REFERRAL_INVITE_BY_CHANNEL,
    GET_REFERRAL_INVITE_BY_CHANNEL_SUCCESS,
    GET_REFERRAL_INVITE_BY_CHANNEL_FAILURE
} from '../types';

/**
 * Action Get Referral Code 
 */
export const getReferralCode = () => ({
    type: GET_REFERRAL_CODE
});

/**
 * Action Get Referral Code Success
 */
export const getReferralCodeSuccess = (response) => ({
    type: GET_REFERRAL_CODE_SUCCESS,
    payload: response
});

/**
 * Action Get Referral Code Error
 */
export const getReferralCodeFailure = (error) => ({
    type: GET_REFERRAL_CODE_FAILURE,
    payload: error
});

//Action For Get Referral URL 
export const getReferralURL = () => ({
    type: GET_REFERRAL_URL
});

export const getReferralURLSuccess = (response) => ({
    type: GET_REFERRAL_URL_SUCCESS,
    payload: response
});

export const getReferralURLFailure = (error) => ({
    type: GET_REFERRAL_URL_FAILURE,
    payload: error
});

 //Action For Get Count Of Referral Dashboard 
 export const getCountReferralDashboard = () => ({
    type: GET_COUNT_REFERRAL_DASHBOARD
});

export const getCountReferralDashboardSuccess = (response) => ({
    type: GET_COUNT_REFERRAL_DASHBOARD_SUCCESS,
    payload: response
});

export const getCountReferralDashboardFailure = (error) => ({
    type: GET_COUNT_REFERRAL_DASHBOARD_FAILURE,
    payload: error
});

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

 export const getPayType = () => ({
    type:GET_PAY_TYPE
});

export const getPayTypeSuccess = (response) => ({
    type:GET_PAY_TYPE_SUCCESS,
    payload:response
});

export const getPayTypeFailure = (error) => ({
    type:GET_PAY_TYPE_FAILURE,
    payload:error
});

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