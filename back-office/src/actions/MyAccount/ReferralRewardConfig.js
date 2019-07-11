/**
 * Created By Sanjay
 * Created Date : 09/02/2019
 * Actions For Configuration Setup In Referral System 
 */

 import {
    ADD_CONFIGURATION_SETUP,
    ADD_CONFIGURATION_SETUP_SUCCESS,
    ADD_CONFIGURATION_SETUP_FAILURE,

    GET_PAY_TYPE,
    GET_PAY_TYPE_SUCCESS,
    GET_PAY_TYPE_FAILURE,

    GET_SERVICE_TYPE,
    GET_SERVICE_TYPE_SUCCESS,
    GET_SERVICE_TYPE_FAILURE,

    LIST_REFERRAL_REWARD_CONFIG,
    LIST_REFERRAL_REWARD_CONFIG_SUCCESS,
    LIST_REFERRAL_REWARD_CONFIG_FAILURE,

    UPDATE_REFERRAL_REWARD_CONFIG,
    UPDATE_REFERRAL_REWARD_CONFIG_SUCCESS,
    UPDATE_REFERRAL_REWARD_CONFIG_FAILURE,

    ACTIVE_REFERRAL_REWARD_CONFIG,
    ACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS,
    ACTIVE_REFERRAL_REWARD_CONFIG_FAILURE,

    INACTIVE_REFERRAL_REWARD_CONFIG,
    INACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS,
    INACTIVE_REFERRAL_REWARD_CONFIG_FAILURE,

    GET_REFERRAL_REWARD_CONFIG_BY_ID,
    GET_REFERRAL_REWARD_CONFIG_BY_ID_SUCCESS,
    GET_REFERRAL_REWARD_CONFIG_BY_ID_FAILURE
 } from '../types';

//For Display Referral Reward Config Data
export const getReferralRewardConfigData = (request) => ({
    type: LIST_REFERRAL_REWARD_CONFIG,
    payload:request
});

export const getReferralRewardConfigDataSuccess = (response) => ({
    type: LIST_REFERRAL_REWARD_CONFIG_SUCCESS,
    payload: response
});

export const getReferralRewardConfigDataFailure = (error) => ({
    type: LIST_REFERRAL_REWARD_CONFIG_FAILURE,
    payload: error
});

 /* Redux Action To Add Configuration Setup For Referral System */
export const addConfigurationSetup = (request) => ({
    type: ADD_CONFIGURATION_SETUP,
    payload: request
});

/* Redux Action To Add Configuration Setup For Referral System Success */
export const addConfigurationSetupSuccess = (response) => ({
    type: ADD_CONFIGURATION_SETUP_SUCCESS,
    payload: response
});

/* Redux Action To Add Configuration Setup For Referral System Failure */
export const addConfigurationSetupFailure = (error) => ({
    type: ADD_CONFIGURATION_SETUP_FAILURE,
    payload: error
});

/**Action For Get Pay Type And Service Type For Drop Down */

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


export const getServiceType = () => ({
    type:GET_SERVICE_TYPE
});

export const getServiceTypeSuccess = (response) => ({
    type:GET_SERVICE_TYPE_SUCCESS,
    payload:response
});

export const getServiceTypeFailure = (error) => ({
    type:GET_SERVICE_TYPE_FAILURE,
    payload:error
});

//For Edit Referral Reward Configuration 

export const updateReferralRewardConfig = (request) => ({
    type: UPDATE_REFERRAL_REWARD_CONFIG,
    payload: request
});

export const updateReferralRewardConfigSuccess = (response) => ({
    type: UPDATE_REFERRAL_REWARD_CONFIG_SUCCESS,
    payload: response
});

export const updateReferralRewardConfigFailure = (error) => ({
    type: UPDATE_REFERRAL_REWARD_CONFIG_FAILURE,
    payload: error
});

/* Redux Action To Active ReferralRewardConfig Data */
export const activeReferralRewardConfig = (request) => ({
    type: ACTIVE_REFERRAL_REWARD_CONFIG,
    payload: request
});

/* Redux Action To Active ReferralRewardConfig Success */
export const activeReferralRewardConfigSuccess = (response) => ({
    type: ACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS,
    payload: response
});

/* Redux Action To Active ReferralRewardConfig Failure */
export const activeReferralRewardConfigFailure = (error) => ({
    type: ACTIVE_REFERRAL_REWARD_CONFIG_FAILURE,
    payload: error
});

/* Redux Action To InActive ReferralRewardConfig Data */
export const inactiveReferralRewardConfig = (request) => ({
    type: INACTIVE_REFERRAL_REWARD_CONFIG,
    payload: request
});

/* Redux Action To InActive ReferralRewardConfig Success */
export const inactiveReferralRewardConfigSuccess = (response) => ({
    type: INACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS,
    payload: response
});

/* Redux Action To InActive ReferralRewardConfig Failure */
export const inactiveReferralRewardConfigFailure = (error) => ({
    type: INACTIVE_REFERRAL_REWARD_CONFIG_FAILURE,
    payload: error
});

/* Redux Action for Get ReferralRewardConfig Data By ID */
export const getReferralRewardConfigById = (request) => ({
    type: GET_REFERRAL_REWARD_CONFIG_BY_ID,
    payload: request
});

/* Redux Action for Get ReferralRewardConfig Data By ID Success */
export const getReferralRewardConfigByIdSuccess = (response) => ({
    type: GET_REFERRAL_REWARD_CONFIG_BY_ID_SUCCESS,
    payload: response
});

/* Redux Action for Get ReferralRewardConfig Data By ID Failure */
export const getReferralRewardConfigByIdFailure = (error) => ({
    type: GET_REFERRAL_REWARD_CONFIG_BY_ID_FAILURE,
    payload: error
});