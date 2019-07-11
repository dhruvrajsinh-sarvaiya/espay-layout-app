/**
 * Created By Sanjay
 * Created Date 13/02/2019
 * Reducer for Referral Channel Type 
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

} from "Actions/types";

const INIT_STATE = {
    referralChannelTypeData: {},
    addReferralChannelTypeData: {},
    editReferralChannelTypeData: {},
    activeReferralChannelTypeData: {},
    inActiceReferralChannelTypeData: {},
    getReferralChannelTypeDataById: {},
    loading: false,
    edit_loading:false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case LIST_REFERRAL_CHANNEL_TYPE:
            return {
                ...state,
                loading: true,
                referralChannelTypeData: {},
                addReferralChannelTypeData: {},
                editReferralChannelTypeData: {},
                activeReferralChannelTypeData: {},
                inActiceReferralChannelTypeData: {},
                getReferralChannelTypeDataById: {}
            };

        case LIST_REFERRAL_CHANNEL_TYPE_SUCCESS:
        case LIST_REFERRAL_CHANNEL_TYPE_FAILURE:
            return { ...state, loading: false, referralChannelTypeData: action.payload };

        case ADD_REFERRAL_CHANNEL_TYPE:
            return { ...state, loading: true, addReferralChannelTypeData: {} };

        case ADD_REFERRAL_CHANNEL_TYPE_SUCCESS:
        case ADD_REFERRAL_CHANNEL_TYPE_FAILURE:
            return { ...state, loading: false, addReferralChannelTypeData: action.payload };

        case UPDATE_REFERRAL_CHANNEL_TYPE:
            return { ...state, edit_loading: true, editReferralChannelTypeData: {} };

        case UPDATE_REFERRAL_CHANNEL_TYPE_SUCCESS:
        case UPDATE_REFERRAL_CHANNEL_TYPE_FAILURE:
            return { ...state, edit_loading: false, editReferralChannelTypeData: action.payload };

        case ACTIVE_REFERRAL_CHANNEL_TYPE:
            return { ...state, loading: true, activeReferralChannelTypeData: {} };

        case ACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS:
        case ACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE:
            return { ...state, loading: false, activeReferralChannelTypeData: action.payload };

        case INACTIVE_REFERRAL_CHANNEL_TYPE:
            return { ...state, loading: true, inActiceReferralChannelTypeData: {} };

        case INACTIVE_REFERRAL_CHANNEL_TYPE_SUCCESS:
        case INACTIVE_REFERRAL_CHANNEL_TYPE_FAILURE:
            return { ...state, loading: false, inActiceReferralChannelTypeData: action.payload };

        case GET_REFERRAL_CHANNEL_TYPE_BY_ID:
            return { ...state, edit_loading: true, getReferralChannelTypeDataById: {} };

        case GET_REFERRAL_CHANNEL_TYPE_BY_ID_SUCCESS:
        case GET_REFERRAL_CHANNEL_TYPE_BY_ID_FAILURE:
            return { ...state, edit_loading: false, getReferralChannelTypeDataById: action.payload };

        default:
            return { ...state };
    }
};