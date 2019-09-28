/**
 * Created By Dipesh
 * Creatde Date 27/02/2019
 * Action For Referral ChannelType 
 */
import {
    //list Referral Channel Type
    LIST_REFERRAL_CHANNEL_TYPE,
    LIST_REFERRAL_CHANNEL_TYPE_SUCCESS,
    LIST_REFERRAL_CHANNEL_TYPE_FAILURE,

    //add Referral Channel Type
    ADD_REFERRAL_CHANNEL_TYPE,
    ADD_REFERRAL_CHANNEL_TYPE_SUCCESS,
    ADD_REFERRAL_CHANNEL_TYPE_FAILURE,

    //edit Referral Channel Type
    UPDATE_REFERRAL_CHANNEL_TYPE,
    UPDATE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    UPDATE_REFERRAL_CHANNEL_TYPE_FAILURE,

    //active Referral Channel Type
    ACTIVE_REFERRAL_CHANNEL_TYPE,
    ACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    ACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,

    //inactive Referral Channel Type
    INACTIVE_REFERRAL_CHANNEL_TYPE,
    INACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    INACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,

    //clear data
    ACTIVE_INACTIVE_REFERRAL_CLEAR,
    CLEAR_DATA_REFERRAL_CHANNEL_TYPE,
} from "../ActionTypes";

//For Display Referral Channel Type Data
export const getReferralChannelTypeData = () => ({
    type: LIST_REFERRAL_CHANNEL_TYPE
});
//For Display Referral Channel Type Data success
export const getReferralChannelTypeDataSuccess = (response) => ({
    type: LIST_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});
//For Display Referral Channel Type Data failure
export const getReferralChannelTypeDataFailure = (error) => ({
    type: LIST_REFERRAL_CHANNEL_TYPE_FAILURE,
    payload: error
});

//For Add Referral Channel Type 
export const addReferralChannelType = (request) => ({
    type: ADD_REFERRAL_CHANNEL_TYPE,
    payload: request
});
//For Add Referral Channel Type success
export const addReferralChannelTypeSuccess = (response) => ({
    type: ADD_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});
//For Add Referral Channel Type failure
export const addReferralChannelTypeFailure = (error) => ({
    type: ADD_REFERRAL_CHANNEL_TYPE_FAILURE,
    payload: error
});

//For Edit Referral Channel Type 
export const updateReferralChannelType = (request) => ({
    type: UPDATE_REFERRAL_CHANNEL_TYPE,
    payload: request
});
//For Edit Referral Channel Type success
export const updateReferralChannelTypeSuccess = (response) => ({
    type: UPDATE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});
//For Edit Referral Channel Type failure
export const updateReferralChannelTypeFailure = (error) => ({
    type: UPDATE_REFERRAL_CHANNEL_TYPE_FAILURE,
    payload: error
});

/* Redux Action To Active Channel Type Data */
export const activeChannelType = (request) => ({
    type: ACTIVE_REFERRAL_CHANNEL_TYPE,
    payload: request
});
/* Redux Action To Active Channel Type Success */
export const activeChannelTypeSuccess = (response) => ({
    type: ACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});
/* Redux Action To Active Channel Type Failure */
export const activeChannelTypeFailure = (error) => ({
    type: ACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,
    payload: error
});
/* Redux Action To InActive Channel Type Data */
export const inactiveChannelType = (request) => ({
    type: INACTIVE_REFERRAL_CHANNEL_TYPE,
    payload: request
});

/* Redux Action To InActive Channel Type Success */
export const inactiveChannelTypeSuccess = (response) => ({
    type: INACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});
/* Redux Action To InActive Channel Type Failure */
export const inactiveChannelTypeFailure = (error) => ({
    type: INACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,
    payload: error
});
/* Redux Action for clear active inactive data */
export const clearActiveInactive = (error) => ({
    type: ACTIVE_INACTIVE_REFERRAL_CLEAR,
});

/* Redux Action for clear all data */
export const clearData = (error) => ({
    type: CLEAR_DATA_REFERRAL_CHANNEL_TYPE,
});