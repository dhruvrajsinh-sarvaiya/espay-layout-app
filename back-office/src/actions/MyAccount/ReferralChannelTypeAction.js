/**
 * Created By Sanjay
 * Creatde Date 13/02/2019
 * Action For Referral ChannelType 
 */
import {

    LIST_REFERRAL_CHANNEL_TYPE,
    LIST_REFERRAL_CHANNEL_TYPE_SUCCESS,
    LIST_REFERRAL_CHANNEL_TYPE_FAILURE,

    ADD_REFERRAL_CHANNEL_TYPE,
    ADD_REFERRAL_CHANNEL_TYPE_SUCCESS,
    ADD_REFERRAL_CHANNEL_TYPE_FAILURE,

    UPDATE_REFERRAL_CHANNEL_TYPE,
    UPDATE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    UPDATE_REFERRAL_CHANNEL_TYPE_FAILURE,

    ACTIVE_REFERRAL_CHANNEL_TYPE,
    ACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    ACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,

    INACTIVE_REFERRAL_CHANNEL_TYPE,
    INACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    INACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE,

    GET_REFERRAL_CHANNEL_TYPE_BY_ID,
    GET_REFERRAL_CHANNEL_TYPE_BY_ID_SUCCESS,
    GET_REFERRAL_CHANNEL_TYPE_BY_ID_FAILURE

} from '../types';

//For Display Referral Channel Type Data

export const getReferralChannelTypeData = () => ({
    type: LIST_REFERRAL_CHANNEL_TYPE
});

export const getReferralChannelTypeDataSuccess = (response) => ({
    type: LIST_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});

export const getReferralChannelTypeDataFailure = (error) => ({
    type: LIST_REFERRAL_CHANNEL_TYPE_FAILURE,
    payload: error
});

//For Add Referral Channel Type 

export const addReferralChannelType = (request) => ({
    type: ADD_REFERRAL_CHANNEL_TYPE,
    payload: request
});

export const addReferralChannelTypeSuccess = (response) => ({
    type: ADD_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});

export const addReferralChannelTypeFailure = (error) => ({
    type: ADD_REFERRAL_CHANNEL_TYPE_FAILURE,
    payload: error
});

//For Edit Referral Channel Type 

export const updateReferralChannelType = (request) => ({
    type: UPDATE_REFERRAL_CHANNEL_TYPE,
    payload: request
});

export const updateReferralChannelTypeSuccess = (response) => ({
    type: UPDATE_REFERRAL_CHANNEL_TYPE_SUCCESS,
    payload: response
});

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

/* Redux Action for Get Referral Channel Type Data By ID */
export const getChannelTypeById = (request) => ({
    type: GET_REFERRAL_CHANNEL_TYPE_BY_ID,
    payload: request
});

/* Redux Action for Get Referral Channel Type Data By ID Success */
export const getChannelTypeByIdSuccess = (response) => ({
    type: GET_REFERRAL_CHANNEL_TYPE_BY_ID_SUCCESS,
    payload: response
});

/* Redux Action for Get Referral Channel Type Data By ID Failure */
export const getChannelTypeByIdFailure = (error) => ({
    type: GET_REFERRAL_CHANNEL_TYPE_BY_ID_FAILURE,
    payload: error
});