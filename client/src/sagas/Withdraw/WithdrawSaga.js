/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    FIle Comment : Withdraw action method's saga implementation
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import AppConfig from 'Constants/AppConfig';
import React from 'react';
import IntlMessages from 'Util/IntlMessages';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
// import types for dispatch puropse
import {
    GET_WD_CURRENCY,
    GET_WD_WALLETS,
    GET_WD_BALANCE,
    GET_FEEANDLIMIT,
    DO_WITHDRAW,
    ADDRESSBYWALLETID,
    WITHDRAWA2FAAUTH,
    WITHDRAWCONFRIMATION,
    WITHDRAW_POLICY
} from 'Actions/types';

// import functions from action
import {
    getCurrencySuccess,
    getCurrencyFailure,
    getWalletsSuccess,
    getWalletsFailure,
    getBalanceSuccess,
    getBalanceFailure,
    getFeeAndLimitsSuccess,
    getFeeAndLimitsFailure,
    doWithdrawSuccess,
    doWithdrawFailure,
    getAddressByIdSuccess,
    getAddressByIdFailure,
    verify2faSuccess,
    verify2faFailure,
    confirmaWithdrawSuccess,
    confirmaWithdrawFailure,
    getWithdrawalPolicySuccess,
    getWithdrawalPolicyFailure
} from 'Actions/Withdraw';
import { NotificationManager } from 'react-notifications';

/* GET CURRENCY LIST */
function* getCurrencySocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/TransactionConfiguration/GetAllServiceConfiguration', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.statusCode == 200 && responseFromSocket.ReturnCode == 0) // success
                yield put(getCurrencySuccess(responseFromSocket.Response));
            else if (responseFromSocket.statusCode == 200 && responseFromSocket.ReturnCode == 1) // failure
                yield put(getCurrencySuccess({}));
            else if (responseFromSocket.statusCode != 200) // other then 200 statuscode
                yield put(getCurrencySuccess({}));
        }
    } catch (error) {
        yield put(getCurrencyFailure(error));
    }
}
function* getCurrency() {
    yield takeEvery(GET_WD_CURRENCY, getCurrencySocket);
}

/* GET WALLETS */
function* getWalletsSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/GetWalletByType/' + payload.request.Coin, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0 && responseFromSocket.statusCode == 200) {
                yield put(getWalletsSuccess(responseFromSocket));
            } else if (responseFromSocket.ReturnCode == 1) {
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${responseFromSocket.ErrorCode}`} />);
                yield put(getWalletsFailure(responseFromSocket.ErrorCode));
            }
        }
    } catch (error) {
        yield put(getWalletsFailure(error));
    }
}
function* getWallets() {
    yield takeEvery(GET_WD_WALLETS, getWalletsSocket)
}

/* DO WITHDRAW REQUEST */
function* doWithdrawSocket(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/Transaction/Withdrawal', request, headers);
    try {
        // if token exp
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else if (responseFromSocket.statusCode != 200 && responseFromSocket.hasOwnProperty('ErrorCode')) {
            // error
            
            yield put(doWithdrawFailure(responseFromSocket.ErrorCode));
        } else {
            if (responseFromSocket.statusCode == 200) // success
                yield put(doWithdrawSuccess(responseFromSocket));
            else if (responseFromSocket.hasOwnProperty('statusCode')) {//fail
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${responseFromSocket.statusCode}`} />);
                yield put(doWithdrawFailure(responseFromSocket.statusCode));
            } else {
                yield put(doWithdrawFailure({}));
            }
        }
    } catch (error) {
        yield put(doWithdrawFailure(error));
    }
}
function* doWithdraw() {
    yield takeEvery(DO_WITHDRAW, doWithdrawSocket);
}

/* GET WALLET BALANCE BY WALLET ID */
function* getBalanceSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/GetAllBalances/' + payload.walletId, payload, headers);
    try {
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else if (responseFromSocket.statusCode != 200 && responseFromSocket.hasOwnProperty('returnMsg')) {
            // error
            NotificationManager.error(responseFromSocket.returnMsg);
        } else if (responseFromSocket.hasOwnProperty('BizResponseObj')) {
            if (responseFromSocket.BizResponseObj.ReturnCode == 0) // success
                yield put(getBalanceSuccess(responseFromSocket));
            else {//fail
                NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${responseFromSocket.BizResponseObj.ErrorCode}`} />);
                yield put(getBalanceFailure(responseFromSocket.BizResponseObj.ErrorCode));
            }
        } else {
            NotificationManager.error(<IntlMessages id={`apiWalletErrCode.${responseFromSocket.ErrorCode}`} />);
            yield put(getBalanceFailure(responseFromSocket.ErrorCode));
        }
    } catch (error) {
        yield put(getBalanceFailure(error));
    }
}
function* getBalance() {
    yield takeEvery(GET_WD_BALANCE, getBalanceSocket)
}

/* GET WALLET FEE & LIMITS */
function* getFeeAndLimitsSocket(payload) {
    let request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/GetServiceLimitChargeValue/' + request.TrnType + '/' + request.CoinName, request, headers);
    try {
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else if (responseFromSocket.statusCode != 200 && responseFromSocket.hasOwnProperty('returnMsg')) {
            // error
            NotificationManager.error(responseFromSocket.returnMsg);
        } else {
            if (responseFromSocket.ReturnCode == 0) // success
                yield put(getFeeAndLimitsSuccess(responseFromSocket.response));
            else //fail
                yield put(getFeeAndLimitsFailure(responseFromSocket.ReturnMsg));
        }
    } catch (error) {
        yield put(getFeeAndLimitsFailure(error));
    }
}
function* getFeeAndLimits() {
    yield takeEvery(GET_FEEANDLIMIT, getFeeAndLimitsSocket)
}


/* GET WALLET ADDRESS BY WALLET ID */
function* getAddressByIdSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOperations/GetWhitelistedBeneficiaries/' + payload.walletId, payload, headers);
    try {
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.BizResponse.ReturnCode == 0) // success
                yield put(getAddressByIdSuccess(responseFromSocket.Beneficiaries));
            else //fail
                yield put(getAddressByIdFailure(responseFromSocket.BizResponse.ReturnMsg));
        }
    } catch (error) {
        yield put(getAddressByIdFailure(error));
    }
}
function* getAddressById() {
    yield takeEvery(ADDRESSBYWALLETID, getAddressByIdSocket)
}

/* VERIFY 2FA AUTHENTICATION FOR WITHDRAWAL */
function* verify2faRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/Manage/TwoFAVerifyCode', payload.request, headers);
    try {
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0) // success
                yield put(verify2faSuccess(responseFromSocket));
            else //fail
                yield put(verify2faFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(verify2faFailure(error));
    }
}
function* verify2fa() {
    yield takeEvery(WITHDRAWA2FAAUTH, verify2faRequest)
}

/* withdraw confirmation request */
function* confirmaWithdrawRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/Transaction/WithdrawalTransaction', payload.request, headers);
    try {
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0) // success
                yield put(confirmaWithdrawSuccess(responseFromSocket));
            else //fail
                yield put(confirmaWithdrawFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(confirmaWithdrawFailure(error));
    }
}
function* confirmaWithdraw() {
    yield takeEvery(WITHDRAWCONFRIMATION, confirmaWithdrawRequest)
}

/* get withdrawl policy request */
function* getWithdrawalPolicyRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/GetTransactionPolicy/' + payload.TrnType, payload.TrnType, headers);
    try {
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0) // success
                yield put(getWithdrawalPolicySuccess(responseFromSocket.Data));
            else //fail
                yield put(getWithdrawalPolicyFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(getWithdrawalPolicyFailure(error));
    }
}
function* getWithdrawalPolicy() {
    yield takeEvery(WITHDRAW_POLICY, getWithdrawalPolicyRequest)
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getCurrency),
        fork(getWallets),
        fork(getBalance),
        fork(getFeeAndLimits),
        fork(doWithdraw),
        fork(getAddressById),
        fork(verify2fa),
        fork(confirmaWithdraw),
        fork(getWithdrawalPolicy),
    ]);
}