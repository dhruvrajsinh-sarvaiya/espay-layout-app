/**
 * Create By Sanjay 
 * Create Date 11/02/2019
 * Actions For Referral Dashboard
 */

//Import Action Type From types 
 import {
    GET_COUNT_REFERRAL_DASHBOARD,
    GET_COUNT_REFERRAL_DASHBOARD_SUCCESS,
    GET_COUNT_REFERRAL_DASHBOARD_FAILUER
 } from '../types';

 //Action For Get Count Of Referral Dashboard 
export const getCountReferralDashboard = () => ({
    type: GET_COUNT_REFERRAL_DASHBOARD
});

export const getCountReferralDashboardSuccess = (response) => ({
    type: GET_COUNT_REFERRAL_DASHBOARD_SUCCESS,
    payload: response
});

export const getCountReferralDashboardFailure = (error) => ({
    type: GET_COUNT_REFERRAL_DASHBOARD_FAILUER,
    payload: error
});