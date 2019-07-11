// sagas For Trade Recon Data Actions By Tejas

// for call axios call or API Call
import api from "Api";

// effects for redux-saga
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

//import functions for get and post Api's
import { swaggerPostAPI } from 'Helpers/helpers';

//get constant data for Appconfig file 
import AppConfig from 'Constants/AppConfig';

// types for set actions and reducers
import {
    GET_TRADE_RECON_LIST,
    ACTIVE_ORDER_LIST,
    SETTLE_ORDER,
    GET_PAIR_LIST,
    SET_TRADE_RECON
} from "Actions/types";

// action sfor set data or response
import {
    getTradeReconListSuccess,
    getTradeReconListFailure,
    getActiveOrdersSuccess,
    getActiveOrdersFailure,
    settleOrderSuccess,
    settleOrderFailure,
    getTradePairsSuccess,
    getTradePairsFailure,
    setTradeReconSuccess,
    setTradeReconFailure,
} from "Actions/TradeRecon";

// Sagas Function for get Trade Recon Data by :Tejas
function* getTradeReconList() {
    yield takeEvery(GET_TRADE_RECON_LIST, getTradeReconListDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTradeReconListDetail({ payload }) {
    const { Data } = payload;

    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradingReconHistory', Data, headers)

        // set response if its available else set error message
        if ( response != null && response.ReturnCode === 0) {
            yield put(getTradeReconListSuccess(response));
        } else {
            yield put(getTradeReconListFailure(response));
        }
    } catch (error) {
        yield put(getTradeReconListFailure(error));
    }
}

// Sagas Function for get Active Orers Data by :Tejas
function* getActiveOrders() {
    yield takeEvery(ACTIVE_ORDER_LIST, getActiveOrdersDetail);
}

// Function for set response to data and Call Function for Api Call
function* getActiveOrdersDetail({ payload }) {
    const { Data } = payload;

    try {
         const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradingSummary', Data);

        // set response if its available else set error message
        if ( response != null && response.ReturnCode === 0) {
            yield put(getActiveOrdersSuccess(response));
        } else {
            yield put(getActiveOrdersFailure(response));
        }
    } catch (error) {
        yield put(getActiveOrdersFailure(error));
    }

}

// Sagas Function for do Settle Orers Data by :Tejas
function* doSettleOrder() {
    yield takeEvery(SETTLE_ORDER, settleOrderDetail);
}

// Function for set response to data and Call Function for Api Call
function* settleOrderDetail({ payload }) {
    const { Data } = payload;
    try {
        const response = yield call(settleOrderRequest, Data);
        // set response if its available else set error message
        if (
            response.ReturnCode === 0
        ) {
            yield put(settleOrderSuccess(response));
        } else {
            yield put(settleOrderFailure(response));
        }
    } catch (error) {
        yield put(settleOrderFailure(error));
    }
}

// function for Call api and set response
const settleOrderRequest = async Data =>
    await api
        .post("settleOrder.js", Data)
        .then(response => response)
        .catch(error => error);

// Sagas Function for get Trade Pairs Data by :Tejas
function* getTradePairs() {
    yield takeEvery(GET_PAIR_LIST, getTradePairsDetail);
}

// Function for set response to data and Call Function for Api Call
function* getTradePairsDetail({ payload }) {
    let request = payload;
    //added by parth andhariya
    let URL = 'api/TransactionConfiguration/ListPair?';
    try {
        var response = []
        //added by parth andhariya
       var headers = { 'Authorization': AppConfig.authorizationToken };
        if (request !== undefined) {
            if (request.hasOwnProperty("IsMargin") && request.IsMargin != "" && request.IsMargin != undefined) {
                URL += "&IsMargin=" + request.IsMargin;
            }
            response = yield call(swaggerPostAPI, URL, request,headers);
        } else {
            response = yield call(swaggerPostAPI, URL, {},headers);
        }
        // set response if its available else set error message
        if (response != null && response.ReturnCode === 0) {
            yield put(getTradePairsSuccess(response));
        } else {
            yield put(getTradePairsFailure(response));
        }
    } catch (error) {
        yield put(getTradePairsFailure(error));
    }
}

// Sagas Function for set Trade Recon Data by :Tejas
function* setTradeRecon() {
    yield takeEvery(SET_TRADE_RECON, setTradeReconDetail);
}

// Function for set response to data and Call Function for Api Call
function* setTradeReconDetail({ payload }) {
    const { Data } = payload;
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradeReconV1', Data, headers)

        // set response if its available else set error message
        if ( response != null && response.ReturnCode === 0) {
            yield put(setTradeReconSuccess(response));
        } else {
            yield put(setTradeReconFailure(response));
        }
    } catch (error) {
        yield put(setTradeReconFailure(error));
    }
}

// Function for root saga
export default function* rootSaga() {
    yield all([
        fork(getTradeReconList),
        fork(getActiveOrders),
        fork(doSettleOrder),
        fork(getTradePairs),
        fork(setTradeRecon),
    ]);
}
