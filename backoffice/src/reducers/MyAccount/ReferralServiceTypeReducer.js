/**
 * Created By Sanjay
 * Created Date 12/02/2019
 * Reducer for Referral Service Type 
 */
import {

    LIST_REFERRAL_SERVICE_TYPE,
    LIST_REFERRAL_SERVICE_TYPE_SUCCESS,
    LIST_REFERRAL_SERVICE_TYPE_FAILURE,

    ADD_REFERRAL_SERVICE_TYPE,
    ADD_REFERRAL_SERVICE_TYPE_SUCCESS,
    ADD_REFERRAL_SERVICE_TYPE_FAILURE,

    UPDATE_REFERRAL_SERVICE_TYPE,
    UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS,
    UPDATE_REFERRAL_SERVICE_TYPE_FAILURE,

    ACTIVE_REFERRAL_SERVICE_TYPE,
    ACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    ACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    INACTIVE_REFERRAL_SERVICE_TYPE,
    INACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS,
    INACTIVE_REFERRAL_SERVICE_TYPE_FAILURE,

    GET_REFERRAL_SERVICE_TYPE_BY_ID,
    GET_REFERRAL_SERVICE_TYPE_BY_ID_SUCCESS,
    GET_REFERRAL_SERVICE_TYPE_BY_ID_FAILURE

} from "Actions/types";

const INIT_STATE = {
    referralServiceTypeData: {},
    addReferralServiceTypeData: {},
    editReferralServiceTypeData: {},
    activeReferralServiceTypeData: {},
    inActiceReferralServiceTypeData: {},
    getReferralServiceTypeDataById: {},
    loading: false,
    edit_loading:false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_REFERRAL_SERVICE_TYPE:
            return {
                ...state,
                loading: true,
                referralServiceTypeData: {},
                addReferralServiceTypeData: {},
                editReferralServiceTypeData: {},
                activeReferralServiceTypeData: {},
                inActiceReferralServiceTypeData: {},
                getReferralServiceTypeDataById: {}
            };

        case LIST_REFERRAL_SERVICE_TYPE_SUCCESS:
            return { ...state, loading: false, referralServiceTypeData: action.payload };

        case LIST_REFERRAL_SERVICE_TYPE_FAILURE:
            return { ...state, loading: false, referralServiceTypeData: action.payload };

        case ADD_REFERRAL_SERVICE_TYPE:
            return { ...state, loading: true, addReferralServiceTypeData: {} };

        case ADD_REFERRAL_SERVICE_TYPE_SUCCESS:
            return { ...state, loading: false, addReferralServiceTypeData: action.payload };

        case ADD_REFERRAL_SERVICE_TYPE_FAILURE:
            return { ...state, loading: false, addReferralServiceTypeData: action.payload };

        case UPDATE_REFERRAL_SERVICE_TYPE:
            return { ...state, edit_loading: true, editReferralServiceTypeData: {} };

        case UPDATE_REFERRAL_SERVICE_TYPE_SUCCESS:
            return { ...state, edit_loading: false, editReferralServiceTypeData: action.payload };

        case UPDATE_REFERRAL_SERVICE_TYPE_FAILURE:
            return { ...state, edit_loading: false, editReferralServiceTypeData: action.payload };

        case ACTIVE_REFERRAL_SERVICE_TYPE:
            return { ...state, loading: true, activeReferralServiceTypeData: {} };

        case ACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS:
            return { ...state, loading: false, activeReferralServiceTypeData: action.payload };

        case ACTIVE_REFERRAL_SERVICE_TYPE_FAILURE:
            return { ...state, loading: false, activeReferralServiceTypeData: action.payload };

        case INACTIVE_REFERRAL_SERVICE_TYPE:
            return { ...state, loading: true, inActiceReferralServiceTypeData: {} };

        case INACTIVE_REFERRAL_SERVICE_TYPE_SUCCESS:
            return { ...state, loading: false, inActiceReferralServiceTypeData: action.payload };

        case INACTIVE_REFERRAL_SERVICE_TYPE_FAILURE:
            return { ...state, loading: false, inActiceReferralServiceTypeData: action.payload };

        case GET_REFERRAL_SERVICE_TYPE_BY_ID:
            return { ...state, edit_loading: true, getReferralServiceTypeDataById: {} };

        case GET_REFERRAL_SERVICE_TYPE_BY_ID_SUCCESS:
            return { ...state, edit_loading: false, getReferralServiceTypeDataById: action.payload };

        case GET_REFERRAL_SERVICE_TYPE_BY_ID_FAILURE:
            return { ...state, edit_loading: false, getReferralServiceTypeDataById: action.payload };

        default:
            return { ...state };
    }
};