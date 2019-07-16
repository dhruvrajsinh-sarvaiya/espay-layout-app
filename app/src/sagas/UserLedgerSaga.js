import { put, call, takeLatest, select } from 'redux-saga/effects';
import { USER_LEDGER_LIST, } from '../actions/ActionTypes';
import { fetchUserLedgerListSuccess, fetchUserLedgerListFailure, } from '../actions/Reports/UserLedgerAction';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI } from '../api/helper';

export default function* UserLedgerSaga() {
    // To register User Ledger method
    yield takeLatest(USER_LEDGER_LIST, fetchUserLedgerList);
}

function* fetchUserLedgerList(actions) {
    try {
        const request = actions.requestUserLedger;

        // create requestUrl
        var swaggerUrl = Method.GetWalletLedgerV1 + '/' + request.FromDate + '/' + request.ToDate + '/' + request.WalletId + '/' + request.PageNo + '/' + request.PageSize;
        
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        
        // To call User Ledger List api
        const data = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
        
        // To set User Ledger List success response to reducer
        yield put(fetchUserLedgerListSuccess(data))
    } catch (error) {
        // To set User Ledger List failure response to reducer
        yield put(fetchUserLedgerListFailure())
    }
}
