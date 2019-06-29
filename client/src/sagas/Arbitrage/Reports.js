/**
 * Auther : Tejas Gauswami
 * Created : 03/06/2019
 * Arbitrage Reports Sagas
 */

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

//Action Types..
import {
    ARBITRAGE_TRADE_HISTORY_REPORT,
    ARBITRAGE_OPEN_ORDER_REPORT,
    DO_CANCEL_ORDER_ARBITRAGE,

    ARBITRAGE_CHART_DATA,
    ARBITRAGE_MARKET_TRADE_HISTORY
} from 'Actions/types';

//Get function form helper for Swagger API Call
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponses, statusErrCodeList } from 'Helpers/helpers';

import {
    getArbitrageChartDataSuccess,
    getArbitrageChartDataFailure,

    arbitrageTradeHistorySuccess,
    arbitrageTradeHistoryFailure,

    doCancelOrderArbitrageSuccess,
    doCancelOrderArbitrageFailure,

    arbitrageOpenOrderSuccess,
    arbitrageOpenOrderFailure,

    arbitrageMarketTradeHistorySuccess,
    arbitrageMarketTradeHistoryFailure

} from "Actions/Arbitrage";

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for Trade History Report
function* arbitrageTradeHistoryData({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/GetTradeHistoryArbitrage', payload, headers);

    try {
        if (response.ReturnCode === 0) {
            yield put(arbitrageTradeHistorySuccess(response));
        } else {
            yield put(arbitrageTradeHistoryFailure(response));
        }
    } catch (error) {
        yield put(arbitrageTradeHistoryFailure(error));
    }
}

//Function for Open Order Report
function* arbitrageOpenOrderData({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/GetActiveOrderArbitrage', payload, headers);// GetActiveOrderArbitrage GetActiveOrder

    try {
        if (response && response != null && response !== undefined) {
            yield put(arbitrageOpenOrderSuccess(response));
        } else {
            yield put(arbitrageOpenOrderFailure("error"))
        }
    } catch (error) {
        yield put(arbitrageOpenOrderFailure('Unable to Fetch Data.'));

    }
}

// Function for set do Bulk Order data and Call Function for Api Call
function* doCancelOrderDataArbitrage({ payload }) {
    const { Order } = payload
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var requestObject = { TranNo: Order.TranNo, CancelAll: Order.CancelAll, OrderType: Order.OrderType }

    if (Order.hasOwnProperty('IsMargin') && Order.IsMargin === 1) {
        requestObject.IsMargin = 1
    }

    const response = yield call(swaggerPostAPI, 'api/Transaction/CancelOrderArbitrage', payload.Order, headers);
    try {

        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            let staticRes = staticResponses(response.statusCode);
            yield put(doCancelOrderArbitrageFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(doCancelOrderArbitrageSuccess(response));
        } else {
            yield put(doCancelOrderArbitrageFailure(response));
        }

    } catch (error) {
        yield put(doCancelOrderArbitrageFailure(error));
    }

}

/* Create Sagas method for tradeHistory */
export function* arbitrageTradeHistory() {
    yield takeEvery(ARBITRAGE_TRADE_HISTORY_REPORT, arbitrageTradeHistoryData);
}

/* Create Sagas method for tradeHistory */
export function* arbitrageOpenOrder() {
    yield takeEvery(ARBITRAGE_OPEN_ORDER_REPORT, arbitrageOpenOrderData);
}

// Sagas Function for get Seller Book data 
function* getArbitrageChartData() {
    yield takeEvery(ARBITRAGE_CHART_DATA, getArbitrageChartDataList)
}

function* doCancelOrderArbiTrage() {
    yield takeEvery(DO_CANCEL_ORDER_ARBITRAGE, doCancelOrderDataArbitrage)
}


/* Create Sagas method for Market tradeHistory */
export function* arbitrageMarketTradeHistory() {
    yield takeEvery(ARBITRAGE_MARKET_TRADE_HISTORY, arbitrageMarketTradeHistoryData);
}

// Function for Seller Ordedr
function* getArbitrageChartDataList({ payload }) {

    var isMargin = '', staticResponse = {};
    if (payload.hasOwnProperty('IsMargin') && payload.IsMargin === 1) {
        isMargin = '?IsMargin=1';
    }
    // end


    const response = yield call(swaggerGetAPI, 'api/Transaction/GetGraphDetailArbitrage/' + payload.Pair + "/" + payload.Interval + isMargin, {});


    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            staticResponse = staticResponse(response.statusCode);
            yield put(getArbitrageChartDataFailure(staticResponse));
        } else if (response.statusCode === 200) {
            yield put(getArbitrageChartDataSuccess(response));
        } else {
            yield put(getArbitrageChartDataFailure(response));
        }
    } catch (error) {
        yield put(getArbitrageChartDataFailure(error));
    }

}


//Function for Market TRade  History Report By Tejas 12/6/2019
function* arbitrageMarketTradeHistoryData({ payload }) {



    var isMargin = '', Pair = "";
    if (payload.hasOwnProperty('marginTrading') && payload.marginTrading === 1) {
        isMargin = '&IsMargin=1';
    } else {
        isMargin = '&IsMargin=0';
    }

    if (payload.hasOwnProperty('Pair') && payload.Pair !== "" && payload.Pair !== undefined) {
        Pair = '?Pair=' + payload.Pair
    }
    // end

    const response = yield call(swaggerGetAPI, 'api/Transaction/GetOrderhistoryArbitrage/' + Pair + isMargin, {});

    try {
        if (response.ReturnCode === 0) {
            yield put(arbitrageMarketTradeHistorySuccess(response));
        } else {
            yield put(arbitrageMarketTradeHistoryFailure(response));
        }
    } catch (error) {
        yield put(arbitrageMarketTradeHistoryFailure(error));
    }
}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(getArbitrageChartData),
        fork(arbitrageTradeHistory),
        fork(arbitrageOpenOrder),
        fork(doCancelOrderArbiTrage),
        fork(arbitrageMarketTradeHistory)
    ]);
}