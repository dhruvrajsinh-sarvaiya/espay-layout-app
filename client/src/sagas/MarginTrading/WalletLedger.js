/* 
    Developer : Vishva shah
    Date : 1-03-2019
    File Comment : list margin wallets Ledger saga method
*/
import { all, call, fork,takeEvery, put} from 'redux-saga/effects';
import {swaggerGetAPI} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    MARGIN_WALLET_LEDGER,
} from 'Actions/types';
import {
    getMarginWalletLedgerSuccess,
    getMarginWalletLedgerFailure,
} from 'Actions/MarginTrading';

// server Request
function* getMaringWalletLedgerRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = '/api/MarginWallet/GetMarginWalletLedger/' +  request.FromDate + '/' + request.ToDate + '/' + request.walletid + '/' + request.Page + '/' + request.PageSize;
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
       
        if (response.ReturnCode == 0) {
            yield put(getMarginWalletLedgerSuccess(response));
        } else {
            yield put(getMarginWalletLedgerFailure(response));
        }
    
} catch (error) {
    yield put(getMarginWalletLedgerFailure(error));
}
} 

export function* getMaringWalletLedger() {
    yield takeEvery(MARGIN_WALLET_LEDGER, getMaringWalletLedgerRequest)
}
// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getMaringWalletLedger),
    ]);
}
