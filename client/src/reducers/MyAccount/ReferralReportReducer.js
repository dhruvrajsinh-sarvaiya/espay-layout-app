/**
 * Create by Sanjay 
 * Created date 06/03/2019
 * Reducer for Referral Report 
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
} from "Actions/types";

const INIT_STATE = {
    clickReferralLinkReportData: {},
    listReferralRewardData: {},
    getReferralServiceData : {},
    loading: false
};



export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case CLICK_REFERRAL_LINK_REPORT:
            return { ...state, loading: true, clickReferralLinkReportData: {} };

        case CLICK_REFERRAL_LINK_REPORT_SUCCESS:
            return { ...state, loading: false, clickReferralLinkReportData: action.payload };

        case CLICK_REFERRAL_LINK_REPORT_FAILURE:
            return { ...state, loading: false, clickReferralLinkReportData: action.payload };

        case REFERRAL_REWARD_REPORT:
            return { ...state, loading: true, listReferralRewardData: {} };

        case REFERRAL_REWARD_REPORT_SUCCESS:
            return { ...state, loading: false, listReferralRewardData: action.payload };

        case REFERRAL_REWARD_REPORT_FAILURE:
            return { ...state, loading: false, listReferralRewardData: action.payload };

        case GET_REFERRAL_SERVICE:
            return { ...state, loading: true, getReferralServiceData: {} };

        case GET_REFERRAL_SERVICE_SUCCESS:
            return { ...state, loading: false, getReferralServiceData: action.payload };

        case GET_REFERRAL_SERVICE_FAILURE:
            return { ...state, loading: false, getReferralServiceData: action.payload };

        default:
            return { ...state };
    }
};