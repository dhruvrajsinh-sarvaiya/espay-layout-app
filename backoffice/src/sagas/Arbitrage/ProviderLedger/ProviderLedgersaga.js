/* 
    Developer : Parth Andhariya
    Date : 17-06-2019
    File Comment : Provider ledger saga methods
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_PROVIDER_LEDGER,
    GET_PROVIDER_WALLETS
} from "Actions/types";
import {
    getProviderWalletsSuccess,
    getProviderWalletsFailure,
    getProviderLedgerSuccess,
    getProviderLedgerFailure,
} from "Actions/Arbitrage/ProviderLedger";

// get organization wallets request
function* getProviderWalletsRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/ArbitrageWalletControlPanel/ListProviderWallet?";
    if (request.hasOwnProperty("SMSCode") && request.SMSCode != "") {
        URL += "&SMSCode=" + request.SMSCode;
    }
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += "&Status=" + request.Status;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getProviderWalletsSuccess(response));
        } else {
            yield put(getProviderWalletsFailure(response));
        }
    } catch (error) {
        yield put(getProviderWalletsFailure(error));
    }
}
// get organization wallet ledger
function* getProviderLedgerRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/ArbitrageWalletControlPanel/GetArbitrageProviderWalletLedger/" + request.FromDate + "/" + request.ToDate + "/" + request.WalletId + "/" + request.Page + "/" + request.PageSize;
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getProviderLedgerSuccess(response));
        } else {
            yield put(getProviderLedgerFailure(response));
        }
    } catch (error) {
        yield put(getProviderLedgerFailure(error));
    }
}
//get organization wallets
export function* getProviderWallets() {
    yield takeEvery(GET_PROVIDER_WALLETS, getProviderWalletsRequest);
}
//get organization wallet ledger
export function* getProviderLedger() {
    yield takeEvery(GET_PROVIDER_LEDGER, getProviderLedgerRequest);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getProviderWallets),
        fork(getProviderLedger)
    ]);
}
