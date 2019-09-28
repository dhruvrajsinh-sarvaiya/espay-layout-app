import {
    //for affliate click on link list
    AFFILIATE_CLICK_ON_LINK_REPORT,
    AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS,
    AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE,

    //for affliate user data
    AFFILIATE_USER_DATA,
    AFFILIATE_USER_DATA_SUCCESS,
    AFFILIATE_USER_DATA_FAILURE,

    //clear reducer data
    AFFILIATE_CLICK_ON_LINK_REPORT_CLEAR,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of clickLink data
    isClickLinkReportFetch: false,
    clickLinkReportData: null,
    clickLinkReportDataFetch: true,

    // for get list of affiliate user data
    isAffiliateUser: false,
    affiliateUserData: null,
    affiliateUserDataFetch: true
}

export default function AffiliateClickOnLinkReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case AFFILIATE_CLICK_ON_LINK_REPORT_CLEAR:
            return initialState;

        // for get list of clickonlink report
        case AFFILIATE_CLICK_ON_LINK_REPORT:
            return Object.assign({}, state, {
                isClickLinkReportFetch: true,
                clickLinkReportData: null,
                clickLinkReportDataFetch: true,
                affiliateUserDataFetch: true,
            })
        // for get list of clickonlink report success
        case AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isClickLinkReportFetch: false,
                clickLinkReportData: action.data,
                clickLinkReportDataFetch: false,
                affiliateUserDataFetch: true,
            })
        // for get list of clickonlink report failure
        case AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE:
            return Object.assign({}, state, {
                isClickLinkReportFetch: false,
                clickLinkReportData: null,
                clickLinkReportDataFetch: false,
                affiliateUserDataFetch: true,
            })

        // for get list of userdata
        case AFFILIATE_USER_DATA:
            return Object.assign({}, state, {
                isAffiliateUser: true,
                affiliateUserData: null,
                affiliateUserDataFetch: true,
                clickLinkReportDataFetch: true,
            })
        // for get list of userdata success
        case AFFILIATE_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: action.data,
                affiliateUserDataFetch: false,
                clickLinkReportDataFetch: true,
            })
        // for get list of userdata failure
        case AFFILIATE_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: null,
                affiliateUserDataFetch: false,
                clickLinkReportDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}