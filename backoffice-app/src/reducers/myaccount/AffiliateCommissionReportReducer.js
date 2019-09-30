// AffiliateCommissionReportReducer.js
import {
    //commission report list  
    AFFILIATE_COMMISSION_REPORT,
    AFFILIATE_COMMISSION_REPORT_SUCCESS,
    AFFILIATE_COMMISSION_REPORT_FAILURE,

    //affliate user data
    AFFILIATE_USER_DATA,
    AFFILIATE_USER_DATA_SUCCESS,
    AFFILIATE_USER_DATA_FAILURE,

    //user data
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    //scheme type mapping 
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS,
    LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE,

    //clear data
    CLEAR_COMMISSION_REPORT_DATA,

    // Action Logout
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // for get list of commission data
    isCommissionReportFetch: false,
    commissionReportData: null,
    commissionReportDataFetch: true,

    // for get list of affiliate user data
    isAffiliateUser: false,
    affiliateUserData: null,
    affiliateUserDataFetch: true,

    // for user data
    isUserData: false,
    userData: null,
    userDataFetch: true,

    // for schemetype maping
    isSchemeTypeList: false,
    schemeMappingList: null,
    schemeMappingListFetch: true
}

export default function AffiliateCommissionReportReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // To reset initial state on clear data
        case CLEAR_COMMISSION_REPORT_DATA:
            return initialState

        // for get list of commission report
        case AFFILIATE_COMMISSION_REPORT:
            return Object.assign({}, state, {
                isCommissionReportFetch: true,
                commissionReportData: null,
                commissionReportDataFetch: true,
                affiliateUserDataFetch: true,
                userDataFetch: true,
                schemeMappingListFetch: true
            })
        // for get list of commission report success
        case AFFILIATE_COMMISSION_REPORT_SUCCESS:
            return Object.assign({}, state, {
                isCommissionReportFetch: false,
                commissionReportData: action.data,
                commissionReportDataFetch: false,
                affiliateUserDataFetch: true,
                userDataFetch: true,
                schemeMappingListFetch: true
            })
        // for get list of commission report failure
        case AFFILIATE_COMMISSION_REPORT_FAILURE:
            return Object.assign({}, state, {
                isCommissionReportFetch: false,
                commissionReportData: null,
                commissionReportDataFetch: false,
                affiliateUserDataFetch: true,
                userDataFetch: true,
                schemeMappingListFetch: true
            })

        // for get list of affiliate userdata
        case AFFILIATE_USER_DATA:
            return Object.assign({}, state, {
                isAffiliateUser: true,
                affiliateUserData: null,
                affiliateUserDataFetch: true,
                commissionReportDataFetch: true,
                userDataFetch: true,
                schemeMappingListFetch: true
            })
        // for get list of affiliate userdata success
        case AFFILIATE_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: action.data,
                affiliateUserDataFetch: false,
                commissionReportDataFetch: true,
                userDataFetch: true,
                schemeMappingListFetch: true
            })
        // for get list of affiliate userdata failure
        case AFFILIATE_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isAffiliateUser: false,
                affiliateUserData: null,
                affiliateUserDataFetch: false,
                commissionReportDataFetch: true,
                userDataFetch: true,
                schemeMappingListFetch: true
            })

        // for get user data list
        case GET_USER_DATA:
            return Object.assign({}, state, {
                isUserData: true,
                userData: null,
                userDataFetch: true,
                commissionReportDataFetch: true,
                affiliateUserDataFetch: true,
                schemeMappingListFetch: true
            })
        // for get user data list success
        case GET_USER_DATA_SUCCESS:
            return Object.assign({}, state, {
                isUserData: false,
                userData: action.payload,
                userDataFetch: false,
                commissionReportDataFetch: true,
                affiliateUserDataFetch: true,
                schemeMappingListFetch: true
            })
        // for get user data list failure
        case GET_USER_DATA_FAILURE:
            return Object.assign({}, state, {
                isUserData: false,
                userData: null,
                userDataFetch: false,
                commissionReportDataFetch: true,
                affiliateUserDataFetch: true,
                schemeMappingListFetch: true
            })

        // for SchemeType MApping List
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING:
            return Object.assign({}, state, {
                isSchemeTypeList: true,
                schemeMappingList: null,
                schemeMappingListFetch: true,
                commissionReportDataFetch: true,
                affiliateUserDataFetch: true,
                userDataFetch: true,
            })
        // for SchemeType MApping List success
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_SUCCESS:
            return Object.assign({}, state, {
                isSchemeTypeList: false,
                schemeMappingList: action.data,
                schemeMappingListFetch: false,
                commissionReportDataFetch: true,
                affiliateUserDataFetch: true,
                userDataFetch: true,
            })
        // for SchemeType MApping List failure
        case LIST_AFFILIATE_SCHEME_TYPE_MAPPING_FAILURE:
            return Object.assign({}, state, {
                isSchemeTypeList: false,
                schemeMappingList: null,
                schemeMappingListFetch: false,
                commissionReportDataFetch: true,
                affiliateUserDataFetch: true,
                userDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
}