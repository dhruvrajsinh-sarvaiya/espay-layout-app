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

    //clear reducer data
    CLEAR_AFFILIATE_DASHBOARD_DATA,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// for dashboard Count
export function affiliateDashboardCount() {
    return action(GET_AFFILIATE_REPORT_DASHBOARD_COUNT)
}
// for dashboard Count success
export function affiliateDashboardCountSuccess(data) {
    return action(GET_AFFILIATE_REPORT_DASHBOARD_COUNT_SUCCESS, { data })
}
// for dashboard Count failure
export function affiliateDashboardCountFailure() {
    return action(GET_AFFILIATE_REPORT_DASHBOARD_COUNT_FAILURE)
}

// for invite chart (pie chart)
export function affiliateInviteChartDetail() {
    return action(GET_AFFILIATE_INVITE_CHART_DETAIL)
}
// for invite chart (pie chart) success
export function affiliateInviteChartDetailSuccess(data) {
    return action(GET_AFFILIATE_INVITE_CHART_DETAIL_SUCCESS, { data })
}
// for invite chart (pie chart) failure 
export function affiliateInviteChartDetailFailure() {
    return action(GET_AFFILIATE_INVITE_CHART_DETAIL_FAILURE)
}

// for invite chart (line chart)
export function affiliateMonthwiseChartDetail(payload) {
    return action(GET_MONTH_WISE_CHART_DETAIL, { payload })
}
// for invite chart (line chart) success
export function affiliateMonthwiseChartDetailSuccess(data) {
    return action(GET_MONTH_WISE_CHART_DETAIL_SUCCESS, { data })
}
// for invite chart (line chart) failure
export function affiliateMonthwiseChartDetailFailure() {
    return action(GET_MONTH_WISE_CHART_DETAIL_FAILURE)
}

//clear reducer data
export function affiliateDashboardDataClear() {
    return action(CLEAR_AFFILIATE_DASHBOARD_DATA)
}