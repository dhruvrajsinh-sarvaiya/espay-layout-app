/**
 * Created By Dipesh 
 * Created Date 01/03/2019
 * Actions For Referral Invitation 
 */
import {

   //get referral participant list
   GET_REFERRAL_PARTICIPATE_LIST,
   GET_REFERRAL_PARTICIPATE_LIST_SUCCESS,
   GET_REFERRAL_PARTICIPATE_LIST_FAILURE,

   //get chanel type
   GET_CHANNEL_TYPE,
   GET_CHANNEL_TYPE_SUCCESS,
   GET_CHANNEL_TYPE_FAILURE,

   //get service list
   GET_SERVICE_LIST,
   GET_SERVICE_LIST_SUCCESS,
   GET_SERVICE_LIST_FAILURE,

   //clear reducer data
   CLEAR_PARTICIPANT
} from '../ActionTypes';

//Redux action get referral participant list 
export const getReferralParticipate = (request) => ({
   type: GET_REFERRAL_PARTICIPATE_LIST,
   payload: request
})
//Redux action get referral participant list success
export const getReferralParticipateSuccess = (responce) => ({
   type: GET_REFERRAL_PARTICIPATE_LIST_SUCCESS,
   payload: responce
})
//Redux action get referral participant list failure
export const getReferralParticipateFailure = (error) => ({
   type: GET_REFERRAL_PARTICIPATE_LIST_FAILURE,
   payload: error
})

//Redux action get chanel type 
export const getChannelType = () => ({
   type: GET_CHANNEL_TYPE
})
//Redux action get chanel type success
export const getChannelTypeSuccess = (responce) => ({
   type: GET_CHANNEL_TYPE_SUCCESS,
   payload: responce
})
//Redux action get chanel type failure
export const getChannelTypeFailure = (error) => ({
   type: GET_CHANNEL_TYPE_FAILURE,
   payload: error
})

//Redux action get chanel type 
export const getServiceList = (request) => ({
   type: GET_SERVICE_LIST,
   payload: request
})
//Redux action get chanel type success
export const getServiceListSuccess = (responce) => ({
   type: GET_SERVICE_LIST_SUCCESS,
   payload: responce
})
//Redux action get chanel type failure
export const getServiceListFailure = (error) => ({
   type: GET_SERVICE_LIST_FAILURE,
   payload: error
})

//clear reducer data
export const clearParticipantData = () => ({
   type: CLEAR_PARTICIPANT,
})


