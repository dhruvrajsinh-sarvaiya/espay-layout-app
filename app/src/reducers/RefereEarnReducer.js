// Action types for Refer and Earn
import {
    // Action Logout
    ACTION_LOGOUT,

    // Estimated Commission
    GET_ENSTIMATED_COMMISSION,
    GET_ENSTIMATED_COMMISSION_SUCCESS,
    GET_ENSTIMATED_COMMISSION_FAILURE,

    // Referral Channel User Count
    GET_REFERRAL_CHANNEL_USER_COUNT,
    GET_REFERRAL_CHANNEL_USER_COUNT_SUCCESS,
    GET_REFERRAL_CHANNEL_USER_COUNT_FAILURE,

    // Referrak Url
    GET_REFERRAL_URL,
    GET_REFERRAL_URL_SUCCESS,
    GET_REFERRAL_URL_FAILURE,

    // Referrak Service Description
    GET_REFERRAL_SERVICE_DESCRIPTION,
    GET_REFERRAL_SERVICE_DESCRIPTION_SUCCESS,
    GET_REFERRAL_SERVICE_DESCRIPTION_FAILURE,

    // Referral Code
    GET_REFERRAL_CODE,
    GET_REFERRAL_CODE_SUCCESS,
    GET_REFERRAL_CODE_FAILURE,

    // Referral Email Send
    REFERRAL_EMAIL_SEND,
    REFERRAL_EMAIL_SEND_SUCCESS,
    REFERRAL_EMAIL_SEND_FAILURE,

    // Referral Sms Send
    REFERRAL_SMS_SEND,
    REFERRAL_SMS_SEND_SUCCESS,
    REFERRAL_SMS_SEND_FAILURE,

    // Clear send data
    CLEAR_SEND_DATA,
    // Clear referral data
    CLEAR_REFERRAL_DATA,
} from '../actions/ActionTypes'

// Initial state for Refer and Earn
const initialState = {
    // Estimated Commission
    loading: false,
    enstimatedCommissionData: null,

    // Referral User Count
    isUsercount: false,
    referralUserCount: null,
    referralUserCountFetch: true,

    // Referral Urls Data
    isUrlget: false,
    referralUrlsData: null,
    referralUrlError: false,

    // Referral Description
    isDescriptionFetch: false,
    referralDescription: null,
    referralDescriptionError: false,

    // Referral Code
    isCodeget: false,
    referralCode: null,
    referralCodeError: false,

    // Email Send
    isEmailSend: false,
    emailData: null,
    emailSendError: false,

    // Sms Send
    isSmsSend: false,
    smsData: null,
    smsSendError: false,
}
export default function RefereEarnReducer(state = initialState, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState;

        // Handle estimated commission method data
        case GET_ENSTIMATED_COMMISSION:
            return {
                ...state,
                loading: true,
                enstimatedCommissionData: null,
                referralCode: null,
            }
        // Set estimated commission success data
        case GET_ENSTIMATED_COMMISSION_SUCCESS:
            return {
                ...state,
                loading: false,
                enstimatedCommissionData: action.response,
            }
        // Set estimated commission failure data
        case GET_ENSTIMATED_COMMISSION_FAILURE:
            return {
                ...state,
                loading: false,
                enstimatedCommissionData: action.response,
            }

        // Handle referral channel user count method data
        case GET_REFERRAL_CHANNEL_USER_COUNT:
            return {
                ...state,
                isUsercount: true,
                referralUserCount: null,
                referralUserCountFetch: true,
            }
        // Set referral channel user count success data
        case GET_REFERRAL_CHANNEL_USER_COUNT_SUCCESS:
            return {
                ...state,
                isUsercount: false,
                referralUserCount: action.response,
                referralUserCountFetch: false,
            }
        // Set referral channel user count failure data
        case GET_REFERRAL_CHANNEL_USER_COUNT_FAILURE:
            return {
                ...state,
                isUsercount: false,
                referralUserCount: null,
                referralUserCountFetch: false,
            }

        // Handle referral url method data
        case GET_REFERRAL_URL:
            return {
                ...state,
                isUrlget: true,
                referralUrlsData: null,
                referralUrlError: false,
            }
        // Set referral url success data
        case GET_REFERRAL_URL_SUCCESS:
            return {
                ...state,
                isUrlget: false,
                referralUrlsData: action.response,
                referralUrlError: false,
            }
        // Set referral url failure data
        case GET_REFERRAL_URL_FAILURE:
            return {
                ...state,
                isUrlget: false,
                referralUrlsData: null,
                referralUrlError: true,
            }

        // Handle referral service description method data
        case GET_REFERRAL_SERVICE_DESCRIPTION:
            return {
                ...state,
                isDescriptionFetch: true,
                referralDescription: null,
                referralDescriptionError: false,
            }
        // Set referral service description success data
        case GET_REFERRAL_SERVICE_DESCRIPTION_SUCCESS:
            return {
                ...state,
                isDescriptionFetch: false,
                referralDescription: action.response,
                referralDescriptionError: false,
            }
        // Set referral service description failure data
        case GET_REFERRAL_SERVICE_DESCRIPTION_FAILURE:
            return {
                ...state,
                isDescriptionFetch: false,
                referralDescription: null,
                referralDescriptionError: true,
            }

        // Handle referral code method data
        case GET_REFERRAL_CODE:
            return {
                ...state,
                isCodeget: true,
                referralCode: null,
                referralCodeError: false,
            }
        // Set referral code success data
        case GET_REFERRAL_CODE_SUCCESS:
            return {
                ...state,
                isCodeget: false,
                referralCode: action.response,
                referralCodeError: false,
            }
        // Set referral code failure data
        case GET_REFERRAL_CODE_FAILURE:
            return {
                ...state,
                isCodeget: false,
                referralCode: null,
                referralCodeError: true,
            }

        // Handle referral email send method data
        case REFERRAL_EMAIL_SEND:
            return {
                ...state,
                isEmailSend: true,
                emailData: null,
                emailSendError: false,
                referralUserCountFetch: true,
            }
        // Set referral email send success data
        case REFERRAL_EMAIL_SEND_SUCCESS:
            return {
                ...state,
                isEmailSend: false,
                emailData: action.response,
                emailSendError: false,
            }
        // Set referral email send failure data
        case REFERRAL_EMAIL_SEND_FAILURE:
            return {
                ...state,
                isEmailSend: false,
                emailData: null,
                emailSendError: true,
            }

        // Handle referral sms send method data
        case REFERRAL_SMS_SEND:
            return {
                ...state,
                isSmsSend: true,
                smsData: null,
                smsSendError: false,
                referralUserCountFetch: true,
            }
        // Set referral sms send success data
        case REFERRAL_SMS_SEND_SUCCESS:
            return {
                ...state,
                isSmsSend: false,
                smsData: action.response,
                smsSendError: false,
            }
        // Set referral sms send failure data
        case REFERRAL_SMS_SEND_FAILURE:
            return {
                ...state,
                isSmsSend: false,
                smsData: null,
                smsSendError: true,
            }
        // Clear send data
        case CLEAR_SEND_DATA:
            return {
                ...state,
                emailData: null,
                smsData: null,
            }
        // Clear referral all data
        case CLEAR_REFERRAL_DATA: {
            return initialState;
        }

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}