/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    FIle Comment : Withdraw history action method's saga implementation
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
// import types for dispatch puropse
import {
    GET_WITHDRAW_HISTORY,
    RESENDMAIL
} from 'Actions/types';
// import functions from action
import {
    getWithdrawalHistorySuccess,
    getWithdrawalHistoryFailure,
    resendMailConfirmationSuccess,
    resendMailConfirmationFailure
} from 'Actions/Withdraw';
const lgnErrCode = loginErrCode();

function* getWithdrawHistoryData(payloadValue) {
    var url = '';
    var payload = payloadValue.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    if (payload.Coin == undefined)
        url = 'api/Wallet/WithdrawalHistoy/' + payload.FromDate + '/' + payload.ToDate;
    else
        url = 'api/Wallet/WithdrawalHistoy/' + payload.FromDate + '/' + payload.ToDate + '?Coin=' + payload.Coin;
    const responseFromSocket = yield call(swaggerGetAPI, url, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getWithdrawalHistorySuccess(responseFromSocket.Histories));
            else
                yield put(getWithdrawalHistoryFailure(responseFromSocket.ReturnMsg));
        }
    } catch (error) {
        yield put(getWithdrawalHistoryFailure(error));
    }
}
// dispatch action for get WithdrawHistory
function* getWithdrawalHistory() {
    yield takeEvery(GET_WITHDRAW_HISTORY, getWithdrawHistoryData)
}
//send mail confirmation request...
function* resendMailConfirmationRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/Transaction/ResendEmailWithdrawalConfirmation/' + payload.trnId, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(resendMailConfirmationSuccess(responseFromSocket));
            else
                yield put(resendMailConfirmationFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(resendMailConfirmationFailure(error));
    }
}
// resend mail confirmation
function* resendMailConfirmation() {
    yield takeEvery(RESENDMAIL, resendMailConfirmationRequest)
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getWithdrawalHistory),
        fork(resendMailConfirmation),
    ]);
}