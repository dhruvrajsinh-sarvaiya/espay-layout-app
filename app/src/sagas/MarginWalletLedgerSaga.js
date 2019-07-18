// MarginWalletLedgerSaga
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { GET_MARGIN_WALLET_LEDGER_DATA } from '../actions/ActionTypes';
import { getMarginWalletLedgerDataSuccess, getMarginWalletLedgerDataFailure } from '../actions/Margin/MarginWalletLedgerAction';
import { swaggerGetAPI } from "../api/helper";
import { Method } from "../controllers/Constants";
import { userAccessToken } from '../selector';

//fetching Ledger list
function* MarginWalletLedgerList(action) {
    try {

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        var request = action.data;

        // create requestUrl
        var URL = Method.GetMarginWalletLedger + request.FromDate + '/' + request.ToDate + '/' + request.WalletId + '/' + request.Page + '/' + request.PageSize;

        // To call Margin Wallet Ledget List api
        const responce = yield call(swaggerGetAPI, URL, {}, headers);

        // To set Margin Wallet ledger list success response to reducer
        yield put(getMarginWalletLedgerDataSuccess(responce))
    } catch (e) {
        // To set Margin Wallet ledger list failure response to reducer
        yield put(getMarginWalletLedgerDataFailure())
    }
}

function* MarginWalletLedgerSaga() {
    // To register MarginWalletLedgerList method
    yield takeLatest(GET_MARGIN_WALLET_LEDGER_DATA, MarginWalletLedgerList)
}
export default MarginWalletLedgerSaga;