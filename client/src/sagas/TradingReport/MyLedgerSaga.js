/**
 * Auther : Tejas Gauswami
 * Created : 29/10/2018
 * My Ledger Sagas
 */

// effects for redux-saga
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// import actions methods for handle response
import {
    myLedgerSuccess,
    myLedgerFailure,
} from 'Actions/TradingReport';

// import action types which is neccessary
import {
    MY_LEDGER,
} from 'Actions/types';

import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();

// function for call api function and check/ handle response and call necessary methods of actions
// Input (transaction request) which is passed from component
function* myLedgerData({ payload }) {
    
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/GetWalletLedger/'+payload.FromDate+'/'+payload.ToDate+'/'+payload.WalletId, {}, headers);
    try {
        // check response code
        
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.statusCode == 200 && typeof responseFromSocket.BizResponseObj !== 'undefined' && responseFromSocket.BizResponseObj.ReturnCode == 0){
                    // success
                     yield put(myLedgerSuccess(responseFromSocket.WalletLedgers));
            } 
            else {
                yield put(myLedgerFailure(responseFromSocket));
            }
        }

    } catch (error) {
        
        yield put(myLedgerFailure(error));
    }

}

/**
 * my ledger List...
 */
export function* myLedger() {
    // call trading ledger action type and sagas api function
    yield takeEvery(MY_LEDGER, myLedgerData);
}

/**
 * My ledger Root Saga declaration with their neccessary methods
 */
export default function* rootSaga() {
    yield all([
        fork(myLedger),        
    ]);
}