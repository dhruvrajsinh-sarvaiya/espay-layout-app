// sagas For Do Buy And Sell Order Actions By Tejas Date : 20/9/2018

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// types for set actions and reducers
import {
    DO_BUY_ORDER,
    DO_SELL_ORDER
} from "Actions/types";

// action sfor set data or response
import {
    doBuyOrderSuccess,
    doBuyOrderFailure,
    doSellOrderSuccess,
    doSellOrderFailure
} from "Actions/Trade";

import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for do Buy Order list data by :Tejas Date : 20/9/2018
function* doSellOrder() {
    yield takeEvery(DO_SELL_ORDER, doSellOrderData);
}

// Sagas Function for do Buy Order list data by :Tejas Date : 20/9/2018
function* doBuyOrder() {
    yield takeEvery(DO_BUY_ORDER, doBuyOrderData);
}

function* doSellOrderData({ payload }) {
    var methodName = '';
    if (payload.sellOrderRequest.hasOwnProperty('marginOrder') && payload.sellOrderRequest.marginOrder === 1) {
        methodName = 'api/Transaction/CreateTransactionOrderMargin/';
    } else {
        methodName = 'api/Transaction/CreateTransactionOrderBG/';
    }

    var pair = payload.sellOrderRequest.Pair

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, methodName + pair, payload.sellOrderRequest, headers);

    try {
        if (statusErrCode.includes(response.statusCode)) {
            let staticRes = staticResponse(response.statusCode);
            yield put(doSellOrderFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(doSellOrderSuccess(response));
        } else {
            yield put(doSellOrderFailure(response));
        }
    } catch (error) {
        yield put(doSellOrderFailure(error));
    }

}

// Function for Open Oders
function* doBuyOrderData({ payload }) {
    var methodName = '';
    if (payload.buyOrderRequest.hasOwnProperty('marginOrder') && payload.buyOrderRequest.marginOrder === 1) {
        methodName = 'api/Transaction/CreateTransactionOrderMargin/';
    } else {
        methodName = 'api/Transaction/CreateTransactionOrderBG/';
    }

    var pair = payload.buyOrderRequest.Pair;

    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, methodName + pair, payload.buyOrderRequest, headers);

    try {

        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            let staticRes = staticResponse(response.statusCode);
            yield put(doBuyOrderFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(doBuyOrderSuccess(response));
        } else {
            yield put(doBuyOrderFailure(response));
        }

    } catch (error) {
        yield put(doBuyOrderFailure(error));
    }

}

// Function for root saga
export default function* rootSaga() {
    yield all([
        fork(doBuyOrder),
        fork(doSellOrder)
    ]);
}
