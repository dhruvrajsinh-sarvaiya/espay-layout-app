/* 
    Developer : Nishant Vadgama
    Date : 06-02-2019
    File Comment : Organization ledger saga methods
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
    swaggerGetAPI,
} from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    GET_ORG_WALLETS,
    GET_ORG_LEDGER
} from "Actions/types";
import {
    getOrganizationWalletsSuccess,
    getOrganizationWalletsFailure,
    getOrganizationLedgerSuccess,
    getOrganizationLedgerFailure
} from "Actions/OrganizationLedger";

// get organization wallets request
function* getOrganizationWalletsRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/WalletControlPanel/ListOrganizationWallet?";
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += "&WalletTypeId=" + request.WalletTypeId;
    }
    if (request.hasOwnProperty("WalletUsageType") && request.WalletUsageType != "") {
        URL += "&WalletUsageType=" + request.WalletUsageType;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getOrganizationWalletsSuccess(response));
        } else {
            yield put(getOrganizationWalletsFailure(response));
        }
    } catch (error) {
        yield put(getOrganizationWalletsFailure(error));
    }
}
// get organization wallet ledger
function* getOrganizationLedgerRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = "api/MasterConfiguration/GetWalletLedger/" + request.FromDate + "/" + request.ToDate + "/" + request.AccWalletId + "/" + request.Page + "/" + request.PageSize;
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getOrganizationLedgerSuccess(response));
        } else {
            yield put(getOrganizationLedgerFailure(response));
        }
    } catch (error) {
        yield put(getOrganizationLedgerFailure(error));
    }
}
//get organization wallets
export function* getOrganizationWallets() {
    yield takeEvery(GET_ORG_WALLETS, getOrganizationWalletsRequest);
}
//get organization wallet ledger
export function* getOrganizationLedger() {
    yield takeEvery(GET_ORG_LEDGER, getOrganizationLedgerRequest);
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getOrganizationWallets),
        fork(getOrganizationLedger)
    ]);
}
