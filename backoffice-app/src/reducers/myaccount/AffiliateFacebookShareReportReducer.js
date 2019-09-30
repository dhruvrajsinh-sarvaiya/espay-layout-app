// AffiliateFacebookShareReportReducer
import {
    //share on facebook list
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE,

    //affliate user data
    AFFILIATE_USER_DATA,
    AFFILIATE_USER_DATA_SUCCESS,
    AFFILIATE_USER_DATA_FAILURE,

    //clear data
    ACTION_LOGOUT,
    AFFILIATE_FACEBOOK_REPORT_CLEAR,
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of facebook data
    isFacebookReportFetch: false,
    facebookReportData: null,
    facebookReportDataFetch: true,

    // for get list of affiliate user data
    isAffiliateUser: false,
    affiliateUserData: null,
    affiliateUserDataFetch: true
}

export default function AffiliateFacebookShareReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case AFFILIATE_FACEBOOK_REPORT_CLEAR:
            return initialState

        // for get list of facebook report
        case AFFILIATE_SHARE_ON_FACEBOOK_REPORT:
            return Object.assign({}, state, {
                isFacebookReportFetch: true,
                facebookReportData: null,
                facebookReportDataFetch: true,
                affiliateUserDataFetch: true,
            })
        // for get list of facebook report success
        case AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isFacebookReportFetch: false,
                facebookReportData: action.data,
                facebookReportDataFetch: false,
                affiliateUserDataFetch: true,
            })
        // for get list of facebook report failure
        case AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE:
            return Object.assign({}, state, {
                isFacebookReportFetch: false,
                facebookReportData: null,
                facebookReportDataFetch: false,
                affiliateUserDataFetch: true,
            })

        // for get list of userdata
        case AFFILIATE_USER_DATA:
            return Object.assign({}, state, {
                isAffiliateUser: true,
                affiliateUserData: null,
                affiliateUserDataFetch: true,
                facebookReportDataFetch: true,
            })
        // for get list of userdata success
        case AFFILIATE_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: action.data,
                affiliateUserDataFetch: false,
                facebookReportDataFetch: true,
            })
        // for get list of userdata failure
        case AFFILIATE_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: null,
                affiliateUserDataFetch: false,
                facebookReportDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}