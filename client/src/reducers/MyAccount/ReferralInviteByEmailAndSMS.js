/**
 * Create By Sanjay 
 * Created Date 04/03/2019
 * Reducer For Referral Invite By Email and SMS
 */

import {
    SEND_REFERRAL_BY_EMAIL,
    SEND_REFERRAL_BY_EMAIL_SUCCESS,
    SEND_REFERRAL_BY_EMAIL_FAILURE,

    SEND_REFERRAL_BY_SMS,
    SEND_REFERRAL_BY_SMS_SUCCESS,
    SEND_REFERRAL_BY_SMS_FAILURE
} from 'Actions/types';

const INIT_STATE = {
    loading: false,
    inviteDataByEmail: {},
    inviteDataBySMS: {}
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SEND_REFERRAL_BY_EMAIL:
            return { ...state, loading: true, inviteDataByEmail: {}, inviteDataBySMS: {} };

        case SEND_REFERRAL_BY_EMAIL_SUCCESS:
            return { ...state, loading: false, inviteDataByEmail: action.payload };

        case SEND_REFERRAL_BY_EMAIL_FAILURE:
            return { ...state, loading: false, inviteDataByEmail: action.payload };

        case SEND_REFERRAL_BY_SMS:
            return { ...state, loading: true, inviteDataBySMS: {}, inviteDataByEmail: {} };

        case SEND_REFERRAL_BY_SMS_SUCCESS:
            return { ...state, loading: false, inviteDataBySMS: action.payload };

        case SEND_REFERRAL_BY_SMS_FAILURE:
            return { ...state, loading: false, inviteDataBySMS: action.payload };

        default:
            return { ...state };
    }
}