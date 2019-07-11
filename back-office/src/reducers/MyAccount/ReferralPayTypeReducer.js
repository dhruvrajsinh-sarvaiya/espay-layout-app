/**
 * Created By Sanjay
 * Created Date 12/02/2019
 * Reducer for Referral Pay Type 
 */
import {

    LIST_REFERRAL_PAY_TYPE,
    LIST_REFERRAL_PAY_TYPE_SUCCESS,
    LIST_REFERRAL_PAY_TYPE_FAILURE,

    ADD_REFERRAL_PAY_TYPE,
    ADD_REFERRAL_PAY_TYPE_SUCCESS,
    ADD_REFERRAL_PAY_TYPE_FAILURE,

    UPDATE_REFERRAL_PAY_TYPE,
    UPDATE_REFERRAL_PAY_TYPE_SUCCESS,
    UPDATE_REFERRAL_PAY_TYPE_FAILURE,

    ACTIVE_REFERRAL_PAY_TYPE,
    ACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    ACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    INACTIVE_REFERRAL_PAY_TYPE,
    INACTIVE_REFERRAL_PAY_TYPE_SUCCESS,
    INACTIVE_REFERRAL_PAY_TYPE_FAILURE,

    GET_REFERRAL_PAY_TYPE_BY_ID,
    GET_REFERRAL_PAY_TYPE_BY_ID_SUCCESS,
    GET_REFERRAL_PAY_TYPE_BY_ID_FAILURE

} from "Actions/types";

const INIT_STATE = {
    referralPayTypeData: {},
    addReferralPayTypeData: {},
    editReferralPayTypeData: {},
    activeReferralPayTypeData: {},
    inActiceReferralPayTypeData: {},
    getReferralPayTypeDataById: {},
    loading: false,
    edit_loading:false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {
        case LIST_REFERRAL_PAY_TYPE:
            return {
                ...state,
                loading: true,
                referralPayTypeData: {},
                addReferralPayTypeData: {},
                editReferralPayTypeData: {},
                activeReferralPayTypeData: {},
                inActiceReferralPayTypeData: {},
                getReferralPayTypeDataById: {}
            };

        case LIST_REFERRAL_PAY_TYPE_SUCCESS:
        case LIST_REFERRAL_PAY_TYPE_FAILURE:
            return { ...state, loading: false, referralPayTypeData: action.payload };

        case ADD_REFERRAL_PAY_TYPE:
            return { ...state, loading: true, addReferralPayTypeData: {} };

        case ADD_REFERRAL_PAY_TYPE_SUCCESS:
        case ADD_REFERRAL_PAY_TYPE_FAILURE:
            return { ...state, loading: false, addReferralPayTypeData: action.payload };

        case UPDATE_REFERRAL_PAY_TYPE:
            return { ...state, edit_loading: true, editReferralPayTypeData: {} };

        case UPDATE_REFERRAL_PAY_TYPE_SUCCESS:
        case UPDATE_REFERRAL_PAY_TYPE_FAILURE:
            return { ...state, edit_loading: false, editReferralPayTypeData: action.payload };

        case ACTIVE_REFERRAL_PAY_TYPE:
            return { ...state, loading: true, activeReferralPayTypeData: {} };

        case ACTIVE_REFERRAL_PAY_TYPE_SUCCESS:
        case ACTIVE_REFERRAL_PAY_TYPE_FAILURE:
            return { ...state, loading: false, activeReferralPayTypeData: action.payload };

        case INACTIVE_REFERRAL_PAY_TYPE:
            return { ...state, loading: true, inActiceReferralPayTypeData: {} };

        case INACTIVE_REFERRAL_PAY_TYPE_SUCCESS:
        case INACTIVE_REFERRAL_PAY_TYPE_FAILURE:
            return { ...state, loading: false, inActiceReferralPayTypeData: action.payload };

        case GET_REFERRAL_PAY_TYPE_BY_ID:
            return { ...state, edit_loading: true, getReferralPayTypeDataById: {} };

        case GET_REFERRAL_PAY_TYPE_BY_ID_SUCCESS:
        case GET_REFERRAL_PAY_TYPE_BY_ID_FAILURE:
            return { ...state, edit_loading: false, getReferralPayTypeDataById: action.payload };

        default:
            return { ...state };
    }
};