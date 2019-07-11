/* 
    Developer : Parth Andhariya
    File Comment : Wallet Ledger Report saga methods
    Date : 1-03-2019
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { swaggerGetAPI } from 'Helpers/helpers';
import { GET_USER_MARGIN_WALLETS, MARGIN_WALLET_LEDGER } from "Actions/types";
import {
    getUserMarginWalletsSuccess,
    getUserMarginWalletsFailure,
    getMarginWalletLedgerSuccess,
    getMarginWalletLedgerFailure
} from "Actions/MarginTrading/WalletLedgerReport";

// user margin walllet list api 
function* getUserMarginWalletsList(payload) {
    const request = payload.request.UserId;
    try {
        var URL = 'api/MarginWalletControlPanel/GetMarginWalletByUserId/' + request;
        const response = yield call(swaggerGetAPI, URL);
        if (response.ReturnCode === 0) {
            yield put(getUserMarginWalletsSuccess(response));
        } else {
            yield put(getUserMarginWalletsFailure(response));
        }
    } catch (error) {
        yield put(getUserMarginWalletsFailure(error));
    }
}

function* getUserMarginWallets() {
    yield takeEvery(GET_USER_MARGIN_WALLETS, getUserMarginWalletsList);
}

//  margin walllet ledger api 
function* getMarginWalletLedgerList(payload) {
    const request = payload.request;
    try {
        var URL = 'api/MarginWalletControlPanel/GetMarginWalletLedger/' + request.FromDate + "/" + request.ToDate + '/' + request.WalletId + "/" + request.PageNo + "/" + request.PageSize;
        const response = yield call(swaggerGetAPI, URL);
        if (response.ReturnCode === 0) {
            yield put(getMarginWalletLedgerSuccess(response));
        } else {
            yield put(getMarginWalletLedgerFailure(response));
        }
    } catch (error) {
        yield put(getMarginWalletLedgerFailure(error));
    }
}
function* getMarginWalletLedger() {
    yield takeEvery(MARGIN_WALLET_LEDGER, getMarginWalletLedgerList);
}
export default function* rootSaga() {
    yield all([
        fork(getUserMarginWallets),
        fork(getMarginWalletLedger)
    ]);
}
