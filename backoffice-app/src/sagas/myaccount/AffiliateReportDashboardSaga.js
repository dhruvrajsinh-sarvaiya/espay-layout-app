// AffiliateReportDashboardSaga.js
import { call, put, takeLatest, select } from 'redux-saga/effects';

//import action types
import {
    GET_AFFILIATE_REPORT_DASHBOARD_COUNT,
    GET_AFFILIATE_INVITE_CHART_DETAIL,
    GET_MONTH_WISE_CHART_DETAIL
} from '../../actions/ActionTypes';

import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI } from '../../api/helper';
import {
    affiliateDashboardCountSuccess,
    affiliateDashboardCountFailure,
    affiliateInviteChartDetailSuccess,
    affiliateInviteChartDetailFailure,
    affiliateMonthwiseChartDetailSuccess,
    affiliateMonthwiseChartDetailFailure,
} from '../../actions/account/AffiliateReportDashboardAction';

// Dashboard Data
function* dashboardCountRequest() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call affliate dashboard count api
        const response = yield call(swaggerGetAPI, Method.GetAffiliateDashboardCount, {}, headers);

        // To set affliate dashboard count success response to reducer
        yield put(affiliateDashboardCountSuccess(response));
    } catch (error) {

        // To set affliate dashboard count failure response to reducer
        yield put(affiliateDashboardCountFailure());
    }
}

// Invite Chart Data
function* inviteChartRequest() {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call invite chart api
        const response = yield call(swaggerGetAPI, Method.GetAffiliateInvitieChartDetail, {}, headers);

        // To set invite chart success response to reducer
        yield put(affiliateInviteChartDetailSuccess(response));
    } catch (error) {

        // To set invite chart failure response to reducer
        yield put(affiliateInviteChartDetailFailure());
    }
}

// Month Wise Commission Chart
function* monthWiseChartRequest({ payload }) {
    try {
        //to get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call month wise commission api
        const response = yield call(swaggerGetAPI, Method.GetMonthWiseCommissionChartDetail + '?Year=' + payload.year, {}, headers);

        // To set month wise commission success response to reducer
        yield put(affiliateMonthwiseChartDetailSuccess(response));
    } catch (error) {

        // To set month wise commission failure response to reducer
        yield put(affiliateMonthwiseChartDetailFailure());
    }
}

//call apis
function* AffiliateReportDashboardSaga() {
    yield takeLatest(GET_AFFILIATE_REPORT_DASHBOARD_COUNT, dashboardCountRequest)
    yield takeLatest(GET_AFFILIATE_INVITE_CHART_DETAIL, inviteChartRequest)
    yield takeLatest(GET_MONTH_WISE_CHART_DETAIL, monthWiseChartRequest)
}

export default AffiliateReportDashboardSaga;