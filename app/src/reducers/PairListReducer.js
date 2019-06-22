// Action types for Pair List
import {
    // Get Pair List
    GET_PAIR_LIST,
    GET_PAIR_LIST_SUCCESS,
    GET_PAIR_LIST_FAILURE,

    // Clear Pair List
    CLEAR_PAIR_LIST,

    // Get Currency List
    GET_CURRENCY_LIST,
    GET_CURRENCY_LIST_SUCCESS,
    GET_CURRENCY_LIST_FAILURE,

    // Get User Data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    // Get Referral Service
    GET_REFERRAL_SERVICE,
    GET_REFERRAL_SERVICE_SUCCESS,
    GET_REFERRAL_SERVICE_FAILURE,

    // Get Referral Paytype
    GET_REFERRAL_PAYTYPE,
    GET_REFERRAL_PAYTYPE_SUCCESS,
    GET_REFERRAL_PAYTYPE_FAILURE,

    // Get Referral Channel Type
    GET_REFERRAL_CHANNEL_TYPE,
    GET_REFERRAL_CHANNEL_TYPE_SUCCESS,
    GET_REFERRAL_CHANNEL_TYPE_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for Pair List
const INTIAL_STATE = {

    //Pair List
    pairList: null,
    isLoadingPair: false,
    pairListError: false,

    //Currency List
    pairCurrencyList: null,
    isLoadingPairCurrency: false,
    pairCurrencyError: false,

    //All User Data
    userData: null,
    isLoadingUserData: false,
    errorUserData: false,

    //All Referral Service
    referralServiceData: null,
    isLoadingReferralService: false,
    errorReferralServiceData: false,

    //All Referral Paytype
    referralPaytypeData: null,
    isLoadingReferralPaytype: false,
    errorReferralPaytypeData: false,

    //All Referral ChannelType
    referralChannelTypeData: null,
    isLoadingReferralChannelType: false,
    errorReferralChannelTypeData: false,
}

export default function pairListReducer(state = INTIAL_STATE, action) {

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Pair List method data
        case GET_PAIR_LIST: {
            return Object.assign({}, state, {
                pairList: null,
                isLoadingPair: true,
                pairListError: false,
            })
        }
        // Set Pair List success data
        case GET_PAIR_LIST_SUCCESS: {
            return Object.assign({}, state, {
                pairList: action.payload,
                isLoadingPair: false,
                pairListError: false
            })
        }
        // Set Pair List failure data
        case GET_PAIR_LIST_FAILURE: {
            return Object.assign({}, state, {
                pairList: null,
                isLoadingPair: false,
                pairListError: true
            })
        }

        // Clear Pair List
        case CLEAR_PAIR_LIST: {
            return Object.assign({}, state, {
                pairList: null,
                isLoadingPair: false,
                pairListError: false,
            })
        }

        // Handle Currency List method data
        case GET_CURRENCY_LIST: {
            return Object.assign({}, state, {
                pairCurrencyList: null,
                isLoadingPairCurrency: true,
                pairCurrencyError: false,
            })
        }
        // Set Currency List success data
        case GET_CURRENCY_LIST_SUCCESS: {
            return Object.assign({}, state, {
                pairCurrencyList: action.payload,
                isLoadingPairCurrency: false,
                pairCurrencyError: false
            })
        }
        // Set Currency List failure data
        case GET_CURRENCY_LIST_FAILURE: {
            return Object.assign({}, state, {
                pairCurrencyList: null,
                isLoadingPairCurrency: false,
                pairCurrencyError: true
            })
        }

        // Handle User Data method data
        case GET_USER_DATA:
            return Object.assign({}, state, {
                userData: null,
                isLoadingUserData: true,
                errorUserData: false,
            });
        // Set User Data success data
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                userData: action.payload,
                isLoadingUserData: false,
                errorUserData: false
            });
        // Set User Data failure data
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                userData: null,
                isLoadingUserData: false,
                errorUserData: true,
            });

        // Handle Referral Service method data
        case GET_REFERRAL_SERVICE:
            return Object.assign({}, state, {
                referralChannelTypeData: null,
                referralPaytypeData: null,
                referralServiceData: null,
                isLoadingReferralService: true,
                errorReferralServiceData: false,
            });
        // Set Referral Service success data
        case GET_REFERRAL_SERVICE_SUCCESS:
            return Object.assign({}, state, {
                referralServiceData: action.payload,
                isLoadingReferralService: false,
                errorReferralServiceData: false
            });
        // Set Referral Service failure data
        case GET_REFERRAL_SERVICE_FAILURE:
            return Object.assign({}, state, {
                referralServiceData: null,
                isLoadingReferralService: false,
                errorReferralServiceData: true,
            });

        // Handle Referral Paytype method data
        case GET_REFERRAL_PAYTYPE:
            return Object.assign({}, state, {
                referralChannelTypeData: null,
                referralServiceData: null,
                referralPaytypeData: null,
                isLoadingReferralPaytype: true,
                errorReferralPaytypeData: false,
            });
        // Set Referral Paytype success data
        case GET_REFERRAL_PAYTYPE_SUCCESS:
            return Object.assign({}, state, {
                referralPaytypeData: action.payload,
                isLoadingReferralPaytype: false,
                errorReferralPaytypeData: false
            });
        // Set Referral Paytype failure data
        case GET_REFERRAL_PAYTYPE_FAILURE:
            return Object.assign({}, state, {
                referralPaytypeData: null,
                isLoadingReferralPaytype: false,
                errorReferralPaytypeData: true,
            });

        // Handle Referral Channel method data
        case GET_REFERRAL_CHANNEL_TYPE:
            return Object.assign({}, state, {
                referralServiceData: null,
                referralPaytypeData: null,
                referralChannelTypeData: null,
                isLoadingReferralChannelType: true,
                errorReferralChannelTypeData: false,
            });
        // Set Referral Channel success data
        case GET_REFERRAL_CHANNEL_TYPE_SUCCESS:
            return Object.assign({}, state, {
                referralChannelTypeData: action.payload,
                isLoadingReferralChannelType: false,
                errorReferralChannelTypeData: false
            });
        // Set Referral Channel failure data
        case GET_REFERRAL_CHANNEL_TYPE_FAILURE:
            return Object.assign({}, state, {
                referralChannelTypeData: null,
                isLoadingReferralChannelType: false,
                errorReferralChannelTypeData: true,
            });

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}