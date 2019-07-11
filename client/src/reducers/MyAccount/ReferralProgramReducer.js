/**
 * Create By Sanjay 
 * Cretaed Date 25/02/2019
 * Reducer For Referral Program 
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
} from 'Actions/types';

const INIT_STATE = {
    loading: true,
    referralCode: {},
    countsOfReferralDashboard: {},
    listReferralInvitationData: {},
    listReferralInviteByChannelData: {},
    listChannelTypeData: {},
    listServiceData: {},
    payTypeData: {},
    listReferralParticipateData: {},
    referralUrl: {},
    ser_loading: false
}

export default (state,action) => {
	if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case GET_REFERRAL_CODE:
            return { ...state, loading: true };

        case GET_REFERRAL_CODE_SUCCESS:
            return { ...state, loading: false, referralCode: action.payload };

        case GET_REFERRAL_CODE_FAILURE:
            return { ...state, loading: false, referralCode: action.payload };

        case GET_REFERRAL_URL:
            return { ...state, loading: true };

        case GET_REFERRAL_URL_SUCCESS:
            return { ...state, loading: false, referralUrl: action.payload };

        case GET_REFERRAL_URL_FAILURE:
            return { ...state, loading: false, referralUrl: action.payload };

        case GET_COUNT_REFERRAL_DASHBOARD:
            return { ...state, loading: true, countsOfReferralDashboard: {} };

        case GET_COUNT_REFERRAL_DASHBOARD_SUCCESS:
            return { ...state, loading: false, countsOfReferralDashboard: action.payload };

        case GET_COUNT_REFERRAL_DASHBOARD_FAILURE:
            return { ...state, loading: false, countsOfReferralDashboard: action.payload };

        case GET_REFERRAL_INVITE_LIST:
            return { ...state, loading: true, listReferralInvitationData: {} };

        case GET_REFERRAL_INVITE_LIST_SUCCESS:
            return { ...state, loading: false, listReferralInvitationData: action.payload };

        case GET_REFERRAL_INVITE_LIST_FAILURE:
            return { ...state, loading: false, listReferralInvitationData: action.payload };

        case GET_CHANNEL_TYPE:
            return { ...state, loading: true, listChannelTypeData: {} };

        case GET_CHANNEL_TYPE_SUCCESS:
            return { ...state, loading: false, listChannelTypeData: action.payload };

        case GET_CHANNEL_TYPE_FAILURE:
            return { ...state, loading: false, listChannelTypeData: action.payload };

        case GET_SERVICE_LIST:
            return { ...state, ser_loading: true, listServiceData: {} };

        case GET_SERVICE_LIST_SUCCESS:
            return { ...state, ser_loading: false, listServiceData: action.payload };

        case GET_SERVICE_LIST_FAILURE:
            return { ...state, ser_loading: false, listServiceData: action.payload };

        case GET_PAY_TYPE:
            return { ...state, loading: true, payTypeData: {} };

        case GET_PAY_TYPE_SUCCESS:
            return { ...state, loading: false, payTypeData: action.payload };

        case GET_PAY_TYPE_FAILURE:
            return { ...state, loading: false, payTypeData: action.payload };

        case GET_REFERRAL_PARTICIPATE_LIST:
            return { ...state, loading: true, listReferralParticipateData: {} };

        case GET_REFERRAL_PARTICIPATE_LIST_SUCCESS:
            return { ...state, loading: false, listReferralParticipateData: action.payload };

        case GET_REFERRAL_PARTICIPATE_LIST_FAILURE:
            return { ...state, loading: false, listReferralParticipateData: action.payload };

        case GET_REFERRAL_INVITE_BY_CHANNEL:
            return { ...state, loading: true, listReferralInviteByChannelData: {} };

        case GET_REFERRAL_INVITE_BY_CHANNEL_SUCCESS:
            return { ...state, loading: false, listReferralInviteByChannelData: action.payload };

        case GET_REFERRAL_INVITE_BY_CHANNEL_FAILURE:
            return { ...state, loading: false, listReferralInviteByChannelData: action.payload };

        default:
            return { ...state };
    }
}