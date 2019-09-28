// AffiliateTwitterShareReportReducer
import {
    //share on twitter list
    AFFILIATE_SHARE_ON_TWITTER_REPORT,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE,

    //affliate user data
    AFFILIATE_USER_DATA,
    AFFILIATE_USER_DATA_SUCCESS,
    AFFILIATE_USER_DATA_FAILURE,

    //clear data 
    ACTION_LOGOUT,
    AFFILIATE_TWITTER_REPORT_CLEAR,
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of Twitter data
    isTwitterReportFetch: false,
    twitterReportData: null,
    twitterReportDataFetch: true,

    // for get list of affiliate user data
    isAffiliateUser: false,
    affiliateUserData: null,
    affiliateUserDataFetch: true
}

export default function AffiliateTwitterShareReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case AFFILIATE_TWITTER_REPORT_CLEAR:
            return initialState;

        // for get list of Twitter report
        case AFFILIATE_SHARE_ON_TWITTER_REPORT:
            return Object.assign({}, state, {
                isTwitterReportFetch: true,
                twitterReportData: null,
                twitterReportDataFetch: true,
                affiliateUserDataFetch: true,
            })
        // for get list of Twitter report success
        case AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isTwitterReportFetch: false,
                twitterReportData: action.data,
                twitterReportDataFetch: false,
                affiliateUserDataFetch: true,
            })
        // for get list of Twitter report failure
        case AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE:
            return Object.assign({}, state, {
                isTwitterReportFetch: false,
                twitterReportData: null,
                twitterReportDataFetch: false,
                affiliateUserDataFetch: true,
            })

        // for get list of userdata
        case AFFILIATE_USER_DATA:
            return Object.assign({}, state, {
                isAffiliateUser: true,
                affiliateUserData: null,
                affiliateUserDataFetch: true,
                twitterReportDataFetch: true,
            })
        // for get list of userdata success
        case AFFILIATE_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: action.data,
                affiliateUserDataFetch: false,
                twitterReportDataFetch: true,
            })
        // for get list of userdata failure
        case AFFILIATE_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: null,
                affiliateUserDataFetch: false,
                twitterReportDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}