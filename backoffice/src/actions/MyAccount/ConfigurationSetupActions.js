/**
 * Created By Sanjay
 * Created Date : 09/02/2019
 * Actions For Configuration Setup In Referral System 
 */

 import {
    ADD_CONFIGURATION_SETUP,
    ADD_CONFIGURATION_SETUP_SUCCESS,
    ADD_CONFIGURATION_SETUP_FAILURE
 } from '../types';

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