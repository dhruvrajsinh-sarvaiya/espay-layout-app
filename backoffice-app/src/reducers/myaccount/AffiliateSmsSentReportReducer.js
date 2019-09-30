// AffiliateSmsSentReportReducer.js
import {
    //for affiliate sms sent report list 
    AFFILIATE_SMS_SENT_REPORT,
    AFFILIATE_SMS_SENT_REPORT_SUCCESS,
    AFFILIATE_SMS_SENT_REPORT_FAILURE,

    //get affliate user data
    AFFILIATE_USER_DATA,
    AFFILIATE_USER_DATA_SUCCESS,
    AFFILIATE_USER_DATA_FAILURE,

    //clear data
    AFFILIATE_SMS_SENT_REPORT_CLEAR,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of SmsSent data
    isSmsSentReportFetch: false,
    smsSentReportData: null,
    smsSentReportDataFetch: true,

    // for get list of affiliate user data
    isAffiliateUser: false,
    affiliateUserData: null,
    affiliateUserDataFetch: true
}

export default function AffiliateSmsSentReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case AFFILIATE_SMS_SENT_REPORT_CLEAR:
            return initialState;

        // for get list of Sms Sent report
        case AFFILIATE_SMS_SENT_REPORT:
            return Object.assign({}, state, {
                isSmsSentReportFetch: true,
                smsSentReportData: null,
                smsSentReportDataFetch: true,
                affiliateUserDataFetch: true,
            })
        // for get list of Sms Sent report success
        case AFFILIATE_SMS_SENT_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isSmsSentReportFetch: false,
                smsSentReportData: action.data,
                smsSentReportDataFetch: false,
                affiliateUserDataFetch: true,
            })
        // for get list of Sms Sent report failure
        case AFFILIATE_SMS_SENT_REPORT_FAILURE:
            return Object.assign({}, state, {
                isSmsSentReportFetch: false,
                smsSentReportData: null,
                smsSentReportDataFetch: false,
                affiliateUserDataFetch: true,
            })

        // for get list of userdata
        case AFFILIATE_USER_DATA:
            return Object.assign({}, state, {
                isAffiliateUser: true,
                affiliateUserData: null,
                affiliateUserDataFetch: true,
                smsSentReportDataFetch: true,
            })
        // for get list of userdata success
        case AFFILIATE_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: action.data,
                affiliateUserDataFetch: false,
                smsSentReportDataFetch: true,
            })
        // for get list of userdata failure
        case AFFILIATE_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: null,
                affiliateUserDataFetch: false,
                smsSentReportDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}