/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    FIle Comment : Deposit history action method's saga implementation
*/
import { all, call, fork, take, put, takeEvery } from 'redux-saga/effects';
import api from 'Api';
import { eventChannel } from 'redux-saga';
import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();
// import types for dispatch puropse
import {
    GET_DEPOSIT_HISTORY
} from 'Actions/types';

// import functions from action
import {
    getDepositHistorySuccess,
    getDepositHistoryFailure
} from 'Actions/Deposit';

function* getDepositHistorySocket(payload) {
    var url = '';
    var payload = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    if (payload.Coin == undefined)
        url = 'api/Wallet/DepositHistoy/' + payload.FromDate + '/' + payload.ToDate;
    else
        url = 'api/Wallet/DepositHistoy/' + payload.FromDate + '/' + payload.ToDate + '?Coin=' + payload.Coin;
    const responseFromSocket = yield call(swaggerGetAPI, url, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getDepositHistorySuccess(responseFromSocket.Histories));
            else
                yield put(getDepositHistoryFailure(responseFromSocket.ReturnMsg));
        }
    } catch (error) {
        console.log(error);
        yield put(getDepositHistoryFailure(error));
    }

}
// dispatch action for get DepositHistory
function* getDepositHistory() {
    yield takeEvery(GET_DEPOSIT_HISTORY, getDepositHistorySocket)
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getDepositHistory)
    ]);
}