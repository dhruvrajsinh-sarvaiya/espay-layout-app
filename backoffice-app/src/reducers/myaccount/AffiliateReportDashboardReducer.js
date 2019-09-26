// AffiliateReportDashboardReducer.js
import {
    //for report dahboard count
    GET_AFFILIATE_REPORT_DASHBOARD_COUNT,
    GET_AFFILIATE_REPORT_DASHBOARD_COUNT_SUCCESS,
    GET_AFFILIATE_REPORT_DASHBOARD_COUNT_FAILURE,

    //for invite chart detail
    GET_AFFILIATE_INVITE_CHART_DETAIL,
    GET_AFFILIATE_INVITE_CHART_DETAIL_SUCCESS,
    GET_AFFILIATE_INVITE_CHART_DETAIL_FAILURE,

    //for month wise chart detail
    GET_MONTH_WISE_CHART_DETAIL,
    GET_MONTH_WISE_CHART_DETAIL_SUCCESS,
    GET_MONTH_WISE_CHART_DETAIL_FAILURE,

    //clear data
    CLEAR_AFFILIATE_DASHBOARD_DATA,
    ACTION_LOGOUT
} from '../../actions/ActionTypes'

const initialState = {
    // dashboard count
    isDashboardCountFetch: false,
    dashboardCountData: null,
    dashboardCountDataFetch: true,

    // invite Chart
    isInviteChartFetch: false,
    inviteChartData: null,
    inviteChartdDataFetch: true,

    // monthly Chart
    isMonthlyChartFetch: false,
    monthlyChartData: null,
    monthlyChartdDataFetch: true,
}

export default function AffiliateReportDashboardReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return initialState

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return initialState

        // clear data
        case CLEAR_AFFILIATE_DASHBOARD_DATA:
            return initialState

        // for Affiliate Dashboard Count
        case GET_AFFILIATE_REPORT_DASHBOARD_COUNT:
            return Object.assign({}, state, {
                isDashboardCountFetch: true,
                dashboardCountData: null,
                dashboardCountDataFetch: true,
                inviteChartdDataFetch: true,
                monthlyChartdDataFetch: true,
            })
        // for Affiliate Dashboard Count success
        case GET_AFFILIATE_REPORT_DASHBOARD_COUNT_SUCCESS:
            return Object.assign({}, state, {
                isDashboardCountFetch: false,
                dashboardCountData: action.data,
                dashboardCountDataFetch: false,
                inviteChartdDataFetch: true,
                monthlyChartdDataFetch: true,
            })
        // for Affiliate Dashboard Count failure
        case GET_AFFILIATE_REPORT_DASHBOARD_COUNT_FAILURE:
            return Object.assign({}, state, {
                isDashboardCountFetch: false,
                dashboardCountData: null,
                dashboardCountDataFetch: false,
                inviteChartdDataFetch: true,
                monthlyChartdDataFetch: true,
            })

        // for Affiliate invite chart
        case GET_AFFILIATE_INVITE_CHART_DETAIL:
            return Object.assign({}, state, {
                isInviteChartFetch: true,
                inviteChartData: null,
                inviteChartdDataFetch: true,
                dashboardCountDataFetch: true,
                monthlyChartdDataFetch: true,
            })
        // for Affiliate invite chart success
        case GET_AFFILIATE_INVITE_CHART_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                isInviteChartFetch: false,
                inviteChartData: action.data,
                inviteChartdDataFetch: false,
                dashboardCountDataFetch: true,
                monthlyChartdDataFetch: true,
            })
        // for Affiliate invite chart failure
        case GET_AFFILIATE_INVITE_CHART_DETAIL_FAILURE:
            return Object.assign({}, state, {
                isInviteChartFetch: false,
                inviteChartData: null,
                inviteChartdDataFetch: false,
                dashboardCountDataFetch: true,
                monthlyChartdDataFetch: true,
            })

        // for Affiliate monthly chart
        case GET_MONTH_WISE_CHART_DETAIL:
            return Object.assign({}, state, {
                isMonthlyChartFetch: true,
                monthlyChartData: null,
                monthlyChartdDataFetch: true,
                dashboardCountDataFetch: true,
                inviteChartdDataFetch: true,
            })
        // for Affiliate monthly chart success
        case GET_MONTH_WISE_CHART_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                isMonthlyChartFetch: false,
                monthlyChartData: action.data,
                monthlyChartdDataFetch: false,
                dashboardCountDataFetch: true,
                inviteChartdDataFetch: true,
            })
        // for Affiliate monthly chart failure
        case GET_MONTH_WISE_CHART_DETAIL_FAILURE:
            return Object.assign({}, state, {
                isMonthlyChartFetch: false,
                monthlyChartData: null,
                monthlyChartdDataFetch: false,
                dashboardCountDataFetch: true,
                inviteChartdDataFetch: true,
            })

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}