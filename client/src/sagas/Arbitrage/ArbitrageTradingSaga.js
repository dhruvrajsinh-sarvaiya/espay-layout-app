/**********
Name: Tejas Gauswami
Use : Saga for Arbitrage Trading Order
Date  : 11/6/2019
*/

// effects for redux-saga
import { all, call, fork, put, takeEvery, take } from 'redux-saga/effects';

import AppConfig from 'Constants/AppConfig';

import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
// types for set actions and reducers
import {
    ARBITRAGE_TRADE_ORDER,
    LIST_EXCHANGE_SMART_ARBITRAGE //added by salim dt:12/06/2019
} from 'Actions/types';

// action sfor set data or response
import {
    arbitrageTradeOrderSuccess,
    arbitrageTradeOrderFailure,
    //added by salim dt:12/06/2019
    listExchangeSmartArbitrageSuccess,
    listExchangeSmartArbitrageFailure
} from 'Actions/Arbitrage';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get Place Order data 
function* arbitrageTradeOrder() {
    yield takeEvery(ARBITRAGE_TRADE_ORDER, arbitrageTradeOrderList)
}

// Function for Buyer Book
function* arbitrageTradeOrderList({ payload }) {

    var headers = { 'Authorization': AppConfig.authorizationToken }
    //const response = yield call(swaggerGetAPI, 'api/Transaction/GetBuyerBook/' + payload.Pair + isMargin, {});
    //const response = yield call(swaggerPostAPI, 'api/Transaction/CreateTransactionOrderArbitrage/' + payload.Pair, payload, headers);
    const response = yield call(swaggerPostAPI, 'api/Transaction/CreateTransactionOrderSmartArbitrage/' + payload.Pair, payload, headers);

    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            staticRes = staticResponse(response.statusCode);
            yield put(arbitrageTradeOrderFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(arbitrageTradeOrderSuccess(response));
        } else {
            yield put(arbitrageTradeOrderFailure(response));
        }
    } catch (error) {
        yield put(arbitrageTradeOrderFailure(error));
    }

}

// Sagas List Exchange Smart Arbitrage API added by salim dt:12/06/2019
function* listExchangeSmartArbitrageSagas() {
    yield takeEvery(LIST_EXCHANGE_SMART_ARBITRAGE, listExchangeSmartArbitrageAPI)
}

// Function List Exchange Smart Arbitrage API added by salim dt:12/06/2019
function* listExchangeSmartArbitrageAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/Transaction/ExchangeListSmartArbitrage/' + payload.Pair, {}, headers);

    try {
        if (response.statusCode === 200) {
            yield put(listExchangeSmartArbitrageSuccess(response));
        } else {
            yield put(listExchangeSmartArbitrageFailure(response));
        }
    } catch (error) {
        yield put(listExchangeSmartArbitrageFailure(error));
    }

}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(arbitrageTradeOrder),
        fork(listExchangeSmartArbitrageSagas), //added by salim dt:12/06/2019
    ]);
}