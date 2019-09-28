import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
    GET_USER_TRADE_COUNT,
    GET_TRADE_USER_MARKET_TYPE_COUNT,
    GET_CONFIGURATION_COUNT,
    GET_TRADE_SUMMARY_COUNT,
    GET_LEDGER_COUNT,
    GET_REPORT_DASHBOARD_COUNT,
} from '../../actions/ActionTypes';
import {
    getUserTradeCountSuccess, getUserTradeCountFailure,
    getTradeUserMarketTypeCountSuccess, getTradeUserMarketTypeCountFailure,
    getConfigurationCountSuccess, getConfigurationCountFailure,
    getTradeSummaryCountSuccess, getTradeSummaryCountFailure,
    getLedgerCountSuccess, getLedgerCountFailure,
    getReportCountSuccess, getReportCountFailure,
} from '../../actions/Trading/TradingDashboardActions';
import { swaggerGetAPI } from '../../api/helper';
import { Method } from '../../controllers/Methods';
import { userAccessToken } from '../../selector';

//call api's
export default function* tradingDashboardBOSaga() {
    // To register Get User Trade Count method
    yield takeEvery(GET_USER_TRADE_COUNT, getUserTradeCounts);
    // To register Get Trade User Market Type Count method
    yield takeEvery(GET_TRADE_USER_MARKET_TYPE_COUNT, getTradeUserMarketTypeCount);
    // To register Get Configuration Count method
    yield takeEvery(GET_CONFIGURATION_COUNT, getConfigurationCount);
    // To register Get Trade Summary Count method
    yield takeEvery(GET_TRADE_SUMMARY_COUNT, getTradeSummaryCount);
    // To register Get Ledger Count method
    yield takeEvery(GET_LEDGER_COUNT, getLedgerCount);
    // To register Get Report Dashboard Count method
    yield takeEvery(GET_REPORT_DASHBOARD_COUNT, getReportCount);
}

function* getUserTradeCounts({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //url
        let url = Method.GetActiveTradeUserCount
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call user trade count api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set user trade count success response to reducer
        yield put(getUserTradeCountSuccess(response))
    } catch (e) {

        // To set user trade count failure response to reducer
        yield put(getUserTradeCountFailure())
    }
}

function* getTradeUserMarketTypeCount({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //url
        let IsMargin = ''
        if (payload.IsMargin !== undefined && payload.IsMargin !== '') {
            IsMargin = '?IsMargin=' + payload.IsMargin;
        }

        // To call trade user market type count api
        const response = yield call(swaggerGetAPI, Method.GetTradeUserMarketTypeCount + '/' + payload.type + IsMargin, {}, headers);

        // To set trade user market type count success response to reducer
        yield put(getTradeUserMarketTypeCountSuccess(response))
    } catch (e) {

        // To set trade user market type count failure response to reducer
        yield put(getTradeUserMarketTypeCountFailure())
    }
}

function* getConfigurationCount({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        //url
        let url = Method.GetConfigurationCount
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call configuration count api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set configuration count success response to reducer
        yield put(getConfigurationCountSuccess(response))
    } catch (e) {

        // To set configuration count failure response to reducer 
        yield put(getConfigurationCountFailure())
    }
}

function* getTradeSummaryCount({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        let url = Method.GetTradeSummaryCount
        if (payload.IsMargin !== undefined && payload.IsMargin != 0) {
            url += '?IsMargin=' + payload.IsMargin;
        }

        // To call trade summary count api
        const response = yield call(swaggerGetAPI, url, {}, headers);

        // To set trade summary count success response to reducer
        yield put(getTradeSummaryCountSuccess(response))
    } catch (e) {

        // To set trade summary count failure response to reducer
        yield put(getTradeSummaryCountFailure())
    }
}

function* getLedgerCount() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call ledger count api
        const response = yield call(swaggerGetAPI, Method.GetLedgerCount, {}, headers);

        // To set ledger count success response to reducer
        yield put(getLedgerCountSuccess(response))
    } catch (e) {

        // To set ledger count failure response to reducer
        yield put(getLedgerCountFailure())
    }
}

function* getReportCount() {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // To call report count api
        const response = yield call(swaggerGetAPI, Method.GetReportCount, {}, headers);

        // To set report count success response to reducer
        yield put(getReportCountSuccess(response))
    } catch (e) {

        // To set report count failure response to reducer
        yield put(getReportCountFailure())
    }
}