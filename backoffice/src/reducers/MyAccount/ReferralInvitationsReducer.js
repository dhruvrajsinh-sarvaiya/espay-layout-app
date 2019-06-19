/**
 * Created By Sanjay 
 * Created Date 21/02/2019
 * Reducer For Referral Invitations
 */

import {
    GET_REFERRAL_INVITE_LIST,
    GET_REFERRAL_INVITE_LIST_SUCCESS,
    GET_REFERRAL_INVITE_LIST_FAILURE,

    GET_REFERRAL_INVITE_BY_CHANNEL,
    GET_REFERRAL_INVITE_BY_CHANNEL_SUCCESS,
    GET_REFERRAL_INVITE_BY_CHANNEL_FAILURE,

    GET_REFERRAL_PARTICIPATE_LIST,
    GET_REFERRAL_PARTICIPATE_LIST_SUCCESS,
    GET_REFERRAL_PARTICIPATE_LIST_FAILURE,

    CLICK_REFERRAL_LINK_REPORT,
    CLICK_REFERRAL_LINK_REPORT_SUCCESS,
    CLICK_REFERRAL_LINK_REPORT_FAILURE,

    REFERRAL_REWARD_REPORT,
    REFERRAL_REWARD_REPORT_SUCCESS,
    REFERRAL_REWARD_REPORT_FAILURE,

    GET_CHANNEL_TYPE,
    GET_CHANNEL_TYPE_SUCCESS,
    GET_CHANNEL_TYPE_FAILURE,

    GET_SERVICE_LIST,
    GET_SERVICE_LIST_SUCCESS,
    GET_SERVICE_LIST_FAILURE
} from "Actions/types";

const INIT_STATE = {
    listReferralInvitationData: {},
    listReferralInviteByChannelData: {},
    listReferralParticipateData: {},
    listChannelTypeData: {},
    listServiceData: {},
    clickReferralLinkReportData: {},
    listReferralRewardData: {},
    loading: false,
    ser_loading: false
};



export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_REFERRAL_INVITE_LIST:
            return { ...state, loading: true, listReferralInvitationData: {} };

        case GET_REFERRAL_INVITE_LIST_SUCCESS:
            return { ...state, loading: false, listReferralInvitationData: action.payload };

        case GET_REFERRAL_INVITE_LIST_FAILURE:
            return { ...state, loading: false, listReferralInvitationData: action.payload };

        case GET_REFERRAL_INVITE_BY_CHANNEL:
            return { ...state, loading: true, listReferralInviteByChannelData: {} };

        case GET_REFERRAL_INVITE_BY_CHANNEL_SUCCESS:
            return { ...state, loading: false, listReferralInviteByChannelData: action.payload };

        case GET_REFERRAL_INVITE_BY_CHANNEL_FAILURE:
            return { ...state, loading: false, listReferralInviteByChannelData: action.payload };

        case GET_REFERRAL_PARTICIPATE_LIST:
            return { ...state, loading: true, listReferralParticipateData: {} };

        case GET_REFERRAL_PARTICIPATE_LIST_SUCCESS:
            return { ...state, loading: false, listReferralParticipateData: action.payload };

        case GET_REFERRAL_PARTICIPATE_LIST_FAILURE:
            return { ...state, loading: false, listReferralParticipateData: action.payload };

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

        default:
            return { ...state };
    }
};