// AffiliateEmailSentReportReducer
import {

    // for get list of EmailSent data
    AFFILIATE_EMAIL_SENT_REPORT,
    AFFILIATE_EMAIL_SENT_REPORT_SUCCESS,
    AFFILIATE_EMAIL_SENT_REPORT_FAILURE,

    // for get list of affiliate user data
    AFFILIATE_USER_DATA,
    AFFILIATE_USER_DATA_SUCCESS,
    AFFILIATE_USER_DATA_FAILURE,

    //clear data
    AFFILIATE_EMAIL_SENT_REPORT_CLEAR,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const INITIAL_STATE = {
    // for get list of EmailSent data
    isEmailSentReportFetch: false,
    emailSentReportData: null,
    emailSentReportDataFetch: true,

    // for get list of affiliate user data
    isAffiliateUser: false,
    affiliateUserData: null,
    affiliateUserDataFetch: true
}

export default function AffiliateEmailSentReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // To reset initial state on clear data
        case AFFILIATE_EMAIL_SENT_REPORT_CLEAR:
            return INITIAL_STATE

        // for get list of Email Sent report
        case AFFILIATE_EMAIL_SENT_REPORT:
            return Object.assign({}, state, {
                isEmailSentReportFetch: true,
                emailSentReportData: null,
                emailSentReportDataFetch: true,
                affiliateUserDataFetch: true,
            })
        // for get list of Email Sent report success
        case AFFILIATE_EMAIL_SENT_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isEmailSentReportFetch: false,
                emailSentReportData: action.data,
                emailSentReportDataFetch: false,
                affiliateUserDataFetch: true,
            })
        // for get list of Email Sent report failure
        case AFFILIATE_EMAIL_SENT_REPORT_FAILURE:
            return Object.assign({}, state, {
                isEmailSentReportFetch: false,
                emailSentReportData: null,
                emailSentReportDataFetch: false,
                affiliateUserDataFetch: true,
            })

        // for get list of userdata
        case AFFILIATE_USER_DATA:
            return Object.assign({}, state, {
                isAffiliateUser: true,
                affiliateUserData: null,
                affiliateUserDataFetch: true,
                emailSentReportDataFetch: true,
            })
        // for get list of userdata success
        case AFFILIATE_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: action.data,
                affiliateUserDataFetch: false,
                emailSentReportDataFetch: true,
            })
        // for get list of userdata failure
        case AFFILIATE_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: null,
                affiliateUserDataFetch: false,
                emailSentReportDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}