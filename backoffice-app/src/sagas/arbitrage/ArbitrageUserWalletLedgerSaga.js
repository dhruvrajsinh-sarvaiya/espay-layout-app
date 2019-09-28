import { call, put, takeEvery, select } from "redux-saga/effects";
import { swaggerGetAPI } from "../../api/helper";
import { Method } from "../../controllers/Methods";
import { userAccessToken } from "../../selector";
import { ARBITRAGE_WALLET_LEDGER } from "../../actions/ActionTypes";
import { getArbiUserWalletLedgerFailure, getArbiUserWalletLedgerSuccess } from "../../actions/Arbitrage/ArbitrageUserWalletLedgerActions";

//  Arbitrage user wallet ledger api 
function* getArbiUserWalletLedgerApi(payload) {

    try {
        const request = payload.request;

        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create request url
        var URL = Method.GetArbitrageWalletLedgerv2 + '/' + request.FromDate + "/" + request.ToDate + '/' + request.WalletId + "/" + request.PageNo + "/" + request.PageSize;

        // To call Get Arbitrage user wallet ledger Data Api
        const response = yield call(swaggerGetAPI, URL, {}, headers);

        // To set Get Arbitrage user wallet ledger success response to reducer
        yield put(getArbiUserWalletLedgerSuccess(response));
    } catch (error) {
        // To set Get Arbitrage user wallet ledger failure response to reducer
        yield put(getArbiUserWalletLedgerFailure(error));
    }
}

export default function* ArbitrageUserWalletLedgerSaga() {
    // To register Arbitrage User Wallet Ledger method
    yield takeEvery(ARBITRAGE_WALLET_LEDGER, getArbiUserWalletLedgerApi);
}
