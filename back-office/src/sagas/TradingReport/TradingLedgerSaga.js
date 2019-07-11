/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Sagas
 */

// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import AppConfig from 'Constants/AppConfig';
// import actions methods for handle response
import {
    tradingledgerSuccess,
    tradingledgerFailure,
    getLedgerCurrencyListSuccess,
    getLedgerCurrencyListFailure,
    getBaseCurrencyListSuccess,
    getBaseCurrencyListFailure
} from "Actions/TradingReport";

// import action types which is neccessary
import {
    TRADING_LEDGER,
    TRADING_LEDGER_REFRESH,
    GET_BASE_CURRENCY_LIST,
    GET_CURRENCY_LIST
} from "Actions/types";
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';

// function for call api function and check/ handle response and call necessary methods of actions
// Input (transaction request) which is passed from component
function* tradingledgerAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/TransactionBackOffice/TradingSummary', payload, {}, headers);

    try {
        if (response.statusCode === 200 && response.ReturnCode === 0) {
            yield put(tradingledgerSuccess(response));
        } else {
            yield put(tradingledgerFailure(response));
        }
    } catch (error) {
        yield put(tradingledgerFailure(error));
    }
}

/**
 * trading ledger List...
 */
export function* tradingledger() {
    // call trading ledger action type and sagas api function
    yield takeEvery(TRADING_LEDGER, tradingledgerAPI);
}

/**
 * trading ledger List on refresh or apply Buttom...
 */
export function* tradingledgerRefresh() {
    // call tradingledger action type and sagas api function
    yield takeEvery(TRADING_LEDGER_REFRESH, tradingledgerAPI);
}

function* getLedgerCurrencyListAPI({ payload }) {
    var request = payload;
    try {
        //added by parth andhariya
        var IsMargin = '';
        var ActiveOnly = '';
        if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
            IsMargin += "&IsMargin=" + request.IsMargin;
        }
        if (request.hasOwnProperty("ActiveOnly") && request.ActiveOnly != "") {
            ActiveOnly += "?&ActiveOnly=" + request.ActiveOnly;
        } else {
            ActiveOnly += "?&ActiveOnly=" + 0;
        }
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerPostAPI, 'api/TransactionConfiguration/ListCurrency' + ActiveOnly + IsMargin, request, headers);

        if (response.statusCode === 200 && response.ReturnCode === 0) {
            yield put(getLedgerCurrencyListSuccess(response));
        } else {
            yield put(getLedgerCurrencyListFailure(response));
        }
    } catch (error) {
        yield put(getLedgerCurrencyListFailure(error));
    }
}

/**
 * trading ledger List...
 */
export function* getLedgerCurrencyList() {
    // call trading ledger action type and sagas api function
    yield takeEvery(GET_CURRENCY_LIST, getLedgerCurrencyListAPI);
}

//added By Tejas 8/2/2019
function* getBaseCurrencyListApi({ payload }) {
    const request = payload;
    //added by parth andhariya
    try {
        var IsMargin = '';
        var ActiveOnly = '';
        if (request.hasOwnProperty("IsMargin") && request.IsMargin != "") {
            IsMargin += "&IsMargin=" + request.IsMargin;
        }
        if (request.hasOwnProperty("ActiveOnly") && request.ActiveOnly != "") {
            ActiveOnly += "?&ActiveOnly=" + request.ActiveOnly;
        } else {
            ActiveOnly += "?&ActiveOnly=" + 0;
        }

        const response = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetBaseMarket' + ActiveOnly + IsMargin, request, {});
        if (response.statusCode === 200 && response.ReturnCode === 0) {
            yield put(getBaseCurrencyListSuccess(response));
        } else {
            yield put(getBaseCurrencyListFailure(response));
        }
    } catch (error) {
        yield put(getBaseCurrencyListFailure(error));
    }
}

// Added By Tejas 8/2/2019
export function* getBaseCurrencyList() {
    // call trading ledger action type and sagas api function
    yield takeEvery(GET_BASE_CURRENCY_LIST, getBaseCurrencyListApi);
}

/**
 * trading ledger Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
    yield all([
        fork(tradingledger),
        fork(tradingledgerRefresh),
        fork(getLedgerCurrencyList),
        fork(getBaseCurrencyList)
    ]);
}