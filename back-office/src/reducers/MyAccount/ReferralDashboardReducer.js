/**
 * Create By Sanjay
 * Created Date 11/02/2019
 * Reducer for Referral Dashboard 
 */

 import {
    GET_COUNT_REFERRAL_DASHBOARD,
    GET_COUNT_REFERRAL_DASHBOARD_SUCCESS,
    GET_COUNT_REFERRAL_DASHBOARD_FAILUER
 } from "Actions/types";

 const INIT_STATE = {
    countsOfReferralDashboard:{},
    loading: false,
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case GET_COUNT_REFERRAL_DASHBOARD:
            return { ...state, loading: true, countsOfReferralDashboard: {}};

        case GET_COUNT_REFERRAL_DASHBOARD_SUCCESS:
        case GET_COUNT_REFERRAL_DASHBOARD_FAILUER:
            return { ...state, loading: false, countsOfReferralDashboard: action.payload };

        default:
            return { ...state };
    }
};