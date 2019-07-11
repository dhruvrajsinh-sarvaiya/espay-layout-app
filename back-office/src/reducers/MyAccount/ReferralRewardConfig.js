/**
 * Created By Sanjay
 * Created Date 09/02/2019
 * Reducer for Configuration Setup in Referral System
 */

import {
    ADD_CONFIGURATION_SETUP,
    ADD_CONFIGURATION_SETUP_SUCCESS,
    ADD_CONFIGURATION_SETUP_FAILURE,

    GET_PAY_TYPE,
    GET_PAY_TYPE_SUCCESS,
    GET_PAY_TYPE_FAILURE,

    GET_SERVICE_TYPE,
    GET_SERVICE_TYPE_SUCCESS,
    GET_SERVICE_TYPE_FAILURE,

    LIST_REFERRAL_REWARD_CONFIG,
    LIST_REFERRAL_REWARD_CONFIG_SUCCESS,
    LIST_REFERRAL_REWARD_CONFIG_FAILURE,

    UPDATE_REFERRAL_REWARD_CONFIG,
    UPDATE_REFERRAL_REWARD_CONFIG_SUCCESS,
    UPDATE_REFERRAL_REWARD_CONFIG_FAILURE,

    ACTIVE_REFERRAL_REWARD_CONFIG,
    ACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS,
    ACTIVE_REFERRAL_REWARD_CONFIG_FAILURE,

    INACTIVE_REFERRAL_REWARD_CONFIG,
    INACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS,
    INACTIVE_REFERRAL_REWARD_CONFIG_FAILURE,

    GET_REFERRAL_REWARD_CONFIG_BY_ID,
    GET_REFERRAL_REWARD_CONFIG_BY_ID_SUCCESS,
    GET_REFERRAL_REWARD_CONFIG_BY_ID_FAILURE
} from "Actions/types";

const INIT_STATE = {
    addConfigSetupData: {},
    payTypeData: {},
    serviceTypeData: {},
    listReferrlaRewardConfigData: {},
    updateReferralRewardConfigData: {},
    enableReferralRewardConfigData: {},
    disableReferralRewardConfigData: {},
    getReferralRewardConfigByIdData: {},
    loading: false,
    list_loading:false
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE
    }
    switch (action.type) {

        case LIST_REFERRAL_REWARD_CONFIG:
            return {
                ...state,
                list_loading: true,
                listReferrlaRewardConfigData: {},
                addConfigSetupData: {},
                payTypeData: {},
                serviceTypeData: {},
                updateReferralRewardConfigData: {},
                enableReferralRewardConfigData: {},
                disableReferralRewardConfigData: {},
                getReferralRewardConfigByIdData: {}
            };

        case LIST_REFERRAL_REWARD_CONFIG_SUCCESS:
        case LIST_REFERRAL_REWARD_CONFIG_FAILURE:
            return { ...state, list_loading: false, listReferrlaRewardConfigData: action.payload };

        case ADD_CONFIGURATION_SETUP:
            return { ...state, loading: true, addConfigSetupData: {} };

        case ADD_CONFIGURATION_SETUP_SUCCESS:
        case ADD_CONFIGURATION_SETUP_FAILURE:
            return { ...state, loading: false, addConfigSetupData: action.payload };

        case GET_PAY_TYPE:
            return { ...state, loading: true, payTypeData: {} };

        case GET_PAY_TYPE_SUCCESS:
        case GET_PAY_TYPE_FAILURE:
            return { ...state, loading: false, payTypeData: action.payload };

        case GET_SERVICE_TYPE:
            return { ...state, loading: true, serviceTypeData: {} };

        case GET_SERVICE_TYPE_SUCCESS:
        case GET_SERVICE_TYPE_FAILURE:
            return { ...state, loading: false, serviceTypeData: action.payload };

        case UPDATE_REFERRAL_REWARD_CONFIG:
            return { ...state, edit_loading: true, updateReferralRewardConfigData: {} };

        case UPDATE_REFERRAL_REWARD_CONFIG_SUCCESS:
        case UPDATE_REFERRAL_REWARD_CONFIG_FAILURE:
            return { ...state, edit_loading: false, updateReferralRewardConfigData: action.payload };

        case ACTIVE_REFERRAL_REWARD_CONFIG:
            return { ...state, list_loading: true, enableReferralRewardConfigData: {} };

        case ACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS:
        case ACTIVE_REFERRAL_REWARD_CONFIG_FAILURE:
            return { ...state, list_loading: false, enableReferralRewardConfigData: action.payload };

        case INACTIVE_REFERRAL_REWARD_CONFIG:
            return { ...state, list_loading: true, disableReferralRewardConfigData: {} };

        case INACTIVE_REFERRAL_REWARD_CONFIG_SUCCESS:
        case INACTIVE_REFERRAL_REWARD_CONFIG_FAILURE:
            return { ...state, list_loading: false, disableReferralRewardConfigData: action.payload };

        case GET_REFERRAL_REWARD_CONFIG_BY_ID:
            return { ...state, loading: true, getReferralRewardConfigByIdData: {} };

        case GET_REFERRAL_REWARD_CONFIG_BY_ID_SUCCESS:
        case GET_REFERRAL_REWARD_CONFIG_BY_ID_FAILURE:
            return { ...state, loading: false, getReferralRewardConfigByIdData: action.payload };

        default:
            return { ...state };
    }
};