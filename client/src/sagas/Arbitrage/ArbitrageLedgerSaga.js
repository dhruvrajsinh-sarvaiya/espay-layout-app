/* 
    Developer : Vishva shah
    Date : 04-06-2019
    File Comment : arbitrage report saga
*/
import { all, call, fork, takeEvery, put } from 'redux-saga/effects';
import { swaggerGetAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_ARBITRAGELEDGER_LIST,
} from 'Actions/types';
import {
    getArbitrageLedgerListSuccess,
    getArbitrageLedgerListFailure,
} from 'Actions/Arbitrage';

// server Request
function* getArbitrageListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = '/api/ArbitrageWallet/GetArbitrageWalletLedger/' + request.FromDate + '/' + request.ToDate + '/' + request.walletid + '/' + request.Page + '/' + request.PageSize;
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getArbitrageLedgerListSuccess(response));
        } else {
            yield put(getArbitrageLedgerListFailure(response));
        }
    } catch (error) {
        yield put(getArbitrageLedgerListFailure(error));
    }
}

export function* getArbitrageList() {
    yield takeEvery(GET_ARBITRAGELEDGER_LIST, getArbitrageListRequest)
}
// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getArbitrageList),
    ]);
}
