/**
 * Auther : Devang Parekh
 * Created : 20/09/2018
 * Transaction History Sagas
 */
// import neccessary saga effects from sagas/effects
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

// import actions methods for handle response
import {
    transactionHistorySuccess,
    transactionHistoryFailure,
} from 'Actions';

import AppConfig from 'Constants/AppConfig';
const socketUrl = AppConfig.socketAPIUrl;

import { swaggerPostAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

// for call api with params
import api from 'Api';

// import action types which is neccessary
import {
    TRANSACTION_HISTORY,
    TRANSACTION_HISTORY_REFRESH
} from 'Actions/types';

// call api for getting transaction history with params
// Input (transaction request)
const getTransactionHistoryRequest = async (transactionHistoryRequest) =>
    await api.get('transHistory.js')
        //.then(console.log('API',transactionHistoryRequest))
        .then(response => response)
        .catch(error => error);

//WebSocket Call...
const watchMessages = (socket, request) => eventChannel((emit) => {
    socket.onopen = () => {
        socket.send(JSON.stringify(request)) // Send data to server
    };
    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        emit(msg);
    };
    return () => {
        socket.close();
    };
});

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