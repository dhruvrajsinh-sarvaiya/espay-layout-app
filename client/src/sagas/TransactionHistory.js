/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Sagas
 */
// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// import actions methods for handle response
import {
    transactionHistorySuccess,
    transactionHistoryFailure,
} from 'Actions';

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';

// import action types which is neccessary
import {
    TRANSACTION_HISTORY,
    TRANSACTION_HISTORY_REFRESH
} from 'Actions/types';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();


// Function for PAIR LIST DATA
function* transactionHistoryAPI({ payload }) {
    var url = '';
    var headers = { 'Authorization': AppConfig.authorizationToken }
    if (payload.IsArbitrage !== undefined && payload.IsArbitrage === 1) {
        url = 'api/Transaction/GetTradeHistoryArbitrage';
    } else {
        url = 'api/Transaction/GetTradeHistory';
    }
    const response = yield call(swaggerPostAPI, url, payload, headers);

    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(transactionHistoryFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(transactionHistorySuccess(response));
        } else {
            yield put(transactionHistoryFailure(response));
        }
    } catch (error) {
        yield put(transactionHistoryFailure(error));
    }

}

/**
 * Transaction History List...
 */
export function* transactionHistory() {
    // call transaction history action type and sagas api function
    yield takeEvery(TRANSACTION_HISTORY, transactionHistoryAPI);
}

/**
 * Transaction History List on refresh or apply Buttom...
 */
export function* transactionHistoryRefresh() {
    // call transaction history action type and sagas api function
    yield takeEvery(TRANSACTION_HISTORY_REFRESH, transactionHistoryAPI);
}

/**
 * Transaction history Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
    yield all([
        fork(transactionHistory),
        fork(transactionHistoryRefresh)
    ]);
}