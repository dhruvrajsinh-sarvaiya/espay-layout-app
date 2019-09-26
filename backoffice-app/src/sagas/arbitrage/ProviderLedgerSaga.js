import { put, call, takeEvery, select, } from 'redux-saga/effects';
import { userAccessToken } from '../../selector';
import { swaggerGetAPI, } from '../../api/helper';
import { Method } from '../../controllers/Constants';
import { getProviderLedgerSuccess, getProviderLedgerFailure } from '../../actions/Arbitrage/ProviderLedgerActions';
import { GET_PROVIDER_LEDGER_DATA } from '../../actions/ActionTypes';

export default function* ProviderLedgerSaga() {
    // To register Get Provider Ledger List method
    yield takeEvery(GET_PROVIDER_LEDGER_DATA, getProviderLedgerList)
}

// Generator for Get Provider Ledger
function* getProviderLedgerList({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': token }

        // Create New Request
        let newRequest = Method.GetArbitrageProviderWalletLedger + '/' + payload.FromDate + '/' + payload.ToDate + '/' + payload.AccWalletId + '/' + payload.Page + '/' + payload.PageSize

        // To call Get Provider Ledger Data Api
        const data = yield call(swaggerGetAPI, newRequest, {}, headers)

        // To set Get Provider Ledger success response to reducer
        yield put(getProviderLedgerSuccess(data))
    } catch (error) {
        // To set Get Provider Ledger failure response to reducer
        yield put(getProviderLedgerFailure())
    }
}