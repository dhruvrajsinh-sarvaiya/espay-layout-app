/**********
Name: Tejas Gauswami
Use : Saga for Place Order
Date  : 5/6/2019
*/

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
// types for set actions and reducers
import {
    ARBITRAGE_PLACE_ORDER,
    ARBITRAGE_PLACE_BULK_ORDER,
} from 'Actions/types';

// action sfor set data or response
import {
    arbitragePlaceOrderSuccess,
    arbitragePlaceOrderFailure,
    arbitragePlaceBulkOrderSuccess,
    arbitragePlaceBulkOrderFailure,
} from 'Actions/Arbitrage';

const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// Sagas Function for get Place Order data 
function* arbitragePlaceOrder() {
    yield takeEvery(ARBITRAGE_PLACE_ORDER, arbitragePlaceOrderList)
}

// Sagas Function for get Place Order data 
function* arbitragePlaceBulkOrder() {
    yield takeEvery(ARBITRAGE_PLACE_BULK_ORDER, arbitragePlaceBulkOrderList)
}

// Function for Buyer Book
function* arbitragePlaceBulkOrderList({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/CreateTransactionOrderArbitrageBulk/' + payload.Pair, payload, headers);
    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(arbitragePlaceBulkOrderFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(arbitragePlaceBulkOrderSuccess(response));
        } else {
            yield put(arbitragePlaceBulkOrderFailure(response));
        }
    } catch (error) {
        yield put(arbitragePlaceBulkOrderFailure(error));
    }

}

// Function for Buyer Book
function* arbitragePlaceOrderList({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/Transaction/CreateTransactionOrderArbitrage/' + payload.Pair, payload, headers);
    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(arbitragePlaceOrderFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(arbitragePlaceOrderSuccess(response));
        } else {
            yield put(arbitragePlaceOrderFailure(response));
        }
    } catch (error) {
        yield put(arbitragePlaceOrderFailure(error));
    }

}

// Function for root saga 
export default function* rootSaga() {
    yield all([
        fork(arbitragePlaceOrder),
        fork(arbitragePlaceBulkOrder)
    ]);
}