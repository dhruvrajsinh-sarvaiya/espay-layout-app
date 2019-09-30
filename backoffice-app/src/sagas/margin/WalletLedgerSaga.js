import { all, call, fork, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI } from "../../api/helper";
import { GET_USER_MARGIN_WALLETS, MARGIN_WALLET_LEDGER } from "../../actions/ActionTypes";
import { Method } from "../../controllers/Methods";
import {
    getUserMarginWalletsSuccess,
    getUserMarginWalletsFailure,
    getMarginWalletLedgerSuccess,
    getMarginWalletLedgerFailure
} from "../../actions/Margin/WalletLedgerAction";
import { userAccessToken } from "../../selector";

// user margin walllet list api 
function* getUserMarginWalletsList(payload) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        const request = payload.request.UserId;

        // Create request url
        var URL = Method.GetMarginWalletByUserId + '/' + request;

        // To call Get User Margin Wallet List  Data Api
        const response = yield call(swaggerGetAPI, URL, {}, headers);

        // To set Get User Margin Wallet List success response to reducer
        yield put(getUserMarginWalletsSuccess(response));
    } catch (error) {
        // To set Get User Margin Wallet List failure response to reducer
        yield put(getUserMarginWalletsFailure(error));
    }
}

function* getUserMarginWallets() {
    // To register Get User Margin Wallets method
    yield takeEvery(GET_USER_MARGIN_WALLETS, getUserMarginWalletsList);
}

//  margin walllet ledger api 
function* getMarginWalletLedgerList(payload) {
    const request = payload.request;
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request url
        var URL = Method.GetMarginWalletLedger + '/' + request.FromDate + "/" + request.ToDate + '/' + request.WalletId + "/" + request.PageNo + "/" + request.PageSize;

        // To call Get Margin Wallet Ledger Data Api
        const response = yield call(swaggerGetAPI, URL, {}, headers);

        // To set Get Margin Wallet Ledger success response to reducer
        yield put(getMarginWalletLedgerSuccess(response));
    } catch (error) {
        // To set Get Margin Wallet Ledger failure response to reducer
        yield put(getMarginWalletLedgerFailure(error));
    }
}

function* getMarginWalletLedger() {
    // To register Margin Wallet Ledger method
    yield takeEvery(MARGIN_WALLET_LEDGER, getMarginWalletLedgerList);
}

export default function* rootSaga() {
    yield all([
        fork(getUserMarginWallets),
        fork(getMarginWalletLedger)
    ]);
}