// Action types for Affiliate Module
import {
    // Action Logout
    ACTION_LOGOUT,

    // Get Affiliate Data
    GET_AFFILIATE_DATA,
    GET_AFFILIATE_DATA_SUCCESS,
    GET_AFFILIATE_DATA_FAILURE,

    // Get Email Send Report
    GET_EMAIL_SEND_REPORT,
    GET_EMAIL_SEND_REPORT_SUCCESS,
    GET_EMAIL_SEND_REPORT_FAILURE,

    // Get Click On Link Report
    GET_CLICK_ON_LINK_REPORT,
    GET_CLICK_ON_LINK_REPORT_SUCCESS,
    GET_CLICK_ON_LINK_REPORT_FAILURE,

    // Get Commision Report
    GET_COMMISSION_REPORT,
    GET_COMMISSION_REPORT_SUCCESS,
    GET_COMMISSION_REPORT_FAILURE,

    // Get Sms Send Report
    GET_SMS_SEND_REPORT,
    GET_SMS_SEND_REPORT_SUCCESS,
    GET_SMS_SEND_REPORT_FAILURE,

    // Get Facebook Share Report
    GET_FACEBOOK_SHARE_REPORT,
    GET_FACEBOOK_SHARE_REPORT_SUCCESS,
    GET_FACEBOOK_SHARE_REPORT_FAILURE,

    // Get Twitter Share Report
    GET_TWITTER_SHARE_REPORT,
    GET_TWITTER_SHARE_REPORT_SUCCESS,
    GET_TWITTER_SHARE_REPORT_FAILURE,

    // Get Affiliate Signup Report
    GET_AFFILIATE_SIGNUP_REPORT,
    GET_AFFILIATE_SIGNUP_REPORT_SUCCESS,
    GET_AFFILIATE_SIGNUP_REPORT_FAILURE,

    // Get Affiliate User List
    GET_AFFILIATE_USER_LIST,
    GET_AFFILIATE_USER_LIST_SUCCESS,
    GET_AFFILIATE_USER_LIST_FAILURE,

    // Clear Affiliate Data
    CLEAR_AFFILIATE_DATA,

    // Get Scheme Mapping Ids
    GET_SCHEME_MAPPING_IDS,
    GET_SCHEME_MAPPING_IDS_SUCCESS,
    GET_SCHEME_MAPPING_IDS_FAILURE,

    // Get Affiliate Pie Chart Data
    GET_AFFILIATE_PIE_CHART_DATA,
    GET_AFFILIATE_PIE_CHART_DATA_SUCCESS,
    GET_AFFILIATE_PIE_CHART_DATA_FAILURE,

    // Get Affiliate Line Chart Data
    GET_AFFILIATE_LINE_CHART_DATA,
    GET_AFFILIATE_LINE_CHART_DATA_SUCCESS,
    GET_AFFILIATE_LINE_CHART_DATA_FAILURE

} from '../actions/ActionTypes'

// Initial state for Affiliate Module
const initialState = {

    // for affiliate count
    isLoading: false,
    affiliateData: null,
    affiliateDataFetch: true,

    // for EmailSendReport
    isEmailFetch: false,
    sendEmailData: null,
    sendEmailDataFetch: true,

    // For click on link report
    clickOnLinkListData: null,
    clickOnLinkLoading: false,

    // For commission report
    commissonListData: null,
    commissionLoading: false,

    // for SMS Send Report
    isSmsFetch: false,
    sendSmsData: null,
    sendSmsDataFetch: true,

    // for facebook Share Report
    isFacebookDataFetch: false,
    facebookShareData: null,
    facebookShareDataFetch: true,

    // for Twitter Share Report
    isTwitterDataFetch: false,
    twitterShareData: null,
    twitterShareDataFetch: true,

    // for Signup Report
    isSignupReportFetch: false,
    signupReportData: null,
    signupReportDataFetch: true,

    // for Affiliate User
    isAffiliateUser: false,
    affiliateUserData: null,
    affiliateUserDataFetch: true,

    // for Pie Chart
    isLoadingPieChart: false,
    pieChartData: null,
    pieChartDataFetch: true,

    // for Line chart
    isLoadingLineChart: false,
    lineChartData: null,
    lineChartDataFetch: true,

    // for scheme mappings ids
    isSchemeMappingIds: false,
    SchmeMappingIdsData: null,

}

export default function AffiliateReducer(state = initialState, action) {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return initialState;
        }

        // Handle affiliate count method data
        case GET_AFFILIATE_DATA:
            return {
                ...state,
                isLoading: true,
                affiliateData: null,
                affiliateDataFetch: true,
                pieChartDataFetch: true,
                lineChartDataFetch: true,
            }
        // Set affiliate count success data
        case GET_AFFILIATE_DATA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                affiliateData: action.data,
                affiliateDataFetch: false,
                pieChartDataFetch: true,
                lineChartDataFetch: true,
            }
        // Set affiliate count failure data
        case GET_AFFILIATE_DATA_FAILURE:
            return {
                ...state,
                isLoading: false,
                affiliateData: null,
                affiliateDataFetch: false,
                pieChartDataFetch: true,
                lineChartDataFetch: true,
            }

        // Handle affiliate pie chart method data
        case GET_AFFILIATE_PIE_CHART_DATA:
            return {
                ...state,
                isLoadingPieChart: true,
                pieChartData: null,
                pieChartDataFetch: true,
                affiliateDataFetch: true,
                lineChartDataFetch: true,
            }
        // Set affiliate pie chart success data
        case GET_AFFILIATE_PIE_CHART_DATA_SUCCESS:
            return {
                ...state,
                isLoadingPieChart: false,
                pieChartData: action.data,
                pieChartDataFetch: false,
                affiliateDataFetch: true,
                lineChartDataFetch: true,
            }
        // Set affiliate pie chart failure data
        case GET_AFFILIATE_PIE_CHART_DATA_FAILURE:
            return {
                ...state,
                isLoadingPieChart: false,
                pieChartData: null,
                pieChartDataFetch: false,
                affiliateDataFetch: true,
                lineChartDataFetch: true,
            }

        // Handle affiliate line chart method data
        case GET_AFFILIATE_LINE_CHART_DATA:
            return {
                ...state,
                isLoadingLineChart: true,
                lineChartData: null,
                lineChartDataFetch: true,
                affiliateDataFetch: true,
                pieChartDataFetch: true,
            }
        // Set affiliate line chart success data
        case GET_AFFILIATE_LINE_CHART_DATA_SUCCESS:
            return {
                ...state,
                isLoadingLineChart: false,
                lineChartData: action.data,
                lineChartDataFetch: false,
                affiliateDataFetch: true,
                pieChartDataFetch: true,
            }
        // Set affiliate line chart failure data
        case GET_AFFILIATE_LINE_CHART_DATA_FAILURE:
            return {
                ...state,
                isLoadingLineChart: false,
                lineChartData: null,
                lineChartDataFetch: false,
                affiliateDataFetch: true,
                pieChartDataFetch: true,
            }

        // Handle email report method data
        case GET_EMAIL_SEND_REPORT:
            return {
                ...state,
                isEmailFetch: true,
                sendEmailData: null,
                sendEmailDataFetch: true,
                affiliateUserDataFetch: true,
            }
        // Set email report success data
        case GET_EMAIL_SEND_REPORT_SUCCESS:
            return {
                ...state,
                isEmailFetch: false,
                sendEmailData: action.data,
                sendEmailDataFetch: false,
                affiliateUserDataFetch: true,
            }
        // Set email report failure data
        case GET_EMAIL_SEND_REPORT_FAILURE:
            return {
                ...state,
                isEmailFetch: false,
                sendEmailData: null,
                sendEmailDataFetch: false,
                affiliateUserDataFetch: true,
            }

        // Handle click on affiliate link report method data
        case GET_CLICK_ON_LINK_REPORT:
            return {
                ...state,
                clickOnLinkLoading: true,
                clickOnLinkListData: null,
                affiliateUserDataFetch: true,
            }
        // Set click on affiliate link report success data
        case GET_CLICK_ON_LINK_REPORT_SUCCESS:
            return {
                ...state,
                clickOnLinkLoading: false,
                clickOnLinkListData: action.data,
                affiliateUserDataFetch: true,
            }
        // Set click on affiliate link report failure data
        case GET_CLICK_ON_LINK_REPORT_FAILURE:
            return {
                ...state,
                clickOnLinkLoading: false,
                clickOnLinkListData: null,
                affiliateUserDataFetch: true,
            }

        // Handle commission report method data
        case GET_COMMISSION_REPORT:
            return {
                ...state,
                commissionLoading: true,
                commissonListData: null,
            }
        // Set commission report success data
        case GET_COMMISSION_REPORT_SUCCESS:
            return {
                ...state,
                commissionLoading: false,
                commissonListData: action.data,
                affiliateUserDataFetch: false,
            }
        // Set commission report failure data
        case GET_COMMISSION_REPORT_FAILURE:
            return {
                ...state,
                commissionLoading: false,
                commissonListData: null,
            }

        // Handle sms report method data
        case GET_SMS_SEND_REPORT:
            return {
                ...state,
                isSmsFetch: true,
                sendSmsData: null,
                sendSmsDataFetch: true,
                affiliateUserDataFetch: true,
            }
        // Set sms report success data
        case GET_SMS_SEND_REPORT_SUCCESS:
            return {
                ...state,
                isSmsFetch: false,
                sendSmsData: action.data,
                sendSmsDataFetch: false,
                affiliateUserDataFetch: true,
            }
        // Set sms report failure data
        case GET_SMS_SEND_REPORT_FAILURE:
            return {
                ...state,
                isSmsFetch: false,
                sendSmsData: null,
                sendSmsDataFetch: false,
                affiliateUserDataFetch: true,
            }

        // Handle 'share link on facebook' report method data
        case GET_FACEBOOK_SHARE_REPORT:
            return {
                ...state,
                isFacebookDataFetch: true,
                facebookShareData: null,
                facebookShareDataFetch: true,
                affiliateUserDataFetch: true,
            }
        // Set 'share link on facebook' report success data
        case GET_FACEBOOK_SHARE_REPORT_SUCCESS:
            return {
                ...state,
                isFacebookDataFetch: false,
                facebookShareData: action.data,
                facebookShareDataFetch: false,
                affiliateUserDataFetch: true,
            }
        // Set 'share link on facebook' report failure data
        case GET_FACEBOOK_SHARE_REPORT_FAILURE:
            return {
                ...state,
                isFacebookDataFetch: false,
                facebookShareData: null,
                facebookShareDataFetch: false,
                affiliateUserDataFetch: true,
            }

        // Handle 'share link on twitter' report method data
        case GET_TWITTER_SHARE_REPORT:
            return {
                ...state,
                isTwitterDataFetch: true,
                twitterShareData: null,
                twitterShareDataFetch: true,
                affiliateUserDataFetch: true,
            }
        // Set 'share link on twitter' report success data
        case GET_TWITTER_SHARE_REPORT_SUCCESS:
            return {
                ...state,
                isTwitterDataFetch: false,
                twitterShareData: action.data,
                twitterShareDataFetch: false,
                affiliateUserDataFetch: true,
            }
        // Set 'share link on twitter' report failure data
        case GET_TWITTER_SHARE_REPORT_FAILURE:
            return {
                ...state,
                isTwitterDataFetch: false,
                twitterShareData: null,
                twitterShareDataFetch: false,
                affiliateUserDataFetch: true,
            }

        // Handle affiliate signup report method data
        case GET_AFFILIATE_SIGNUP_REPORT:
            return {
                ...state,
                isSignupReportFetch: true,
                signupReportData: null,
                signupReportDataFetch: true,
                affiliateUserDataFetch: true,
            }
        // Set affiliate signup report success data
        case GET_AFFILIATE_SIGNUP_REPORT_SUCCESS:
            return {
                ...state,
                isSignupReportFetch: false,
                signupReportData: action.data,
                signupReportDataFetch: false,
                affiliateUserDataFetch: true,
            }
        // Set affiliate signup report failure data
        case GET_AFFILIATE_SIGNUP_REPORT_FAILURE:
            return {
                ...state,
                isSignupReportFetch: false,
                signupReportData: null,
                signupReportDataFetch: false,
                affiliateUserDataFetch: true,
            }

        // Handle affiliate user list method data
        case GET_AFFILIATE_USER_LIST:
            return {
                ...state,
                isAffiliateUser: true,
                affiliateUserData: null,
                affiliateUserDataFetch: true,
                sendEmailDataFetch: true,
                sendSmsDataFetch: true,
                facebookShareDataFetch: true,
                twitterShareDataFetch: true,
                signupReportDataFetch: true,
            }
        // Set affiliate user list success data
        case GET_AFFILIATE_USER_LIST_SUCCESS:
            return {
                ...state,
                isAffiliateUser: false,
                affiliateUserData: action.data,
                affiliateUserDataFetch: false,
                sendEmailDataFetch: true,
                sendSmsDataFetch: true,
                facebookShareDataFetch: true,
                twitterShareDataFetch: true,
                signupReportDataFetch: true,
            }
        // Set affiliate user list failure data
        case GET_AFFILIATE_USER_LIST_FAILURE:
            return {
                ...state,
                isAffiliateUser: false,
                affiliateUserData: null,
                affiliateUserDataFetch: false,
                sendEmailDataFetch: true,
                sendSmsDataFetch: true,
                facebookShareDataFetch: true,
                twitterShareDataFetch: true,
                signupReportDataFetch: true,
            }

        // Clear affiliate all data
        case CLEAR_AFFILIATE_DATA:
            return {
                ...state,
                affiliateUserDataFetch: true,
                signupReportDataFetch: true,
                facebookShareDataFetch: true,
                twitterShareDataFetch: true,
                sendEmailDataFetch: true,
                sendSmsDataFetch: true,
                affiliateUserData: null,
                signupReportData: null,
                twitterShareData: null,
                facebookShareData: null,
                sendSmsData: null,
                commissonListData: null,
                clickOnLinkListData: null,
                sendEmailData: null,
            }

        // Handle scheme mapping ids method data
        case GET_SCHEME_MAPPING_IDS: {
            return {
                ...state,
                SchmeMappingIdsData: null,
                isSchemeMappingIds: true,
            }
        }
        // Set scheme mapping ids success data
        case GET_SCHEME_MAPPING_IDS_SUCCESS: {
            return {
                ...state,
                SchmeMappingIdsData: action.payload,
                isSchemeMappingIds: false,
            }
        }
        // Set scheme mapping ids failure data
        case GET_SCHEME_MAPPING_IDS_FAILURE: {
            return {
                ...state,
                SchmeMappingIdsData: null,
                isSchemeMappingIds: false,
            }
        }
        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}