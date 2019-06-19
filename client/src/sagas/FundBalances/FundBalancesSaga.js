/* 
    Developer : Nishant Vadgama
    Date : 25-10-2018
    FIle Comment : Fund Balances page saga methods
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
    GET_ALL_BALANCE,
    GET_WALLETBALANCE,
} from 'Actions/types';

// import functions from action
import {
    getAllBalanceSuccess,
    getAllBalanceFailure,
    getWalletsBalanceSuccess,
    getWalletsBalanceFailure
} from 'Actions/FundBalances';

// get all balance method
function* getAllBalanceSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/GetAvailbleBalTypeWise', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.BizResponseObj.ReturnCode == 0 && responseFromSocket.statusCode == 200) {
                yield put(getAllBalanceSuccess(responseFromSocket));
            } else if (responseFromSocket.BizResponseObj.ReturnCode == 1) {
                yield put(getAllBalanceFailure(responseFromSocket.BizResponseObj.ReturnMsg));
            }
        }
    } catch (error) {
        yield put(getAllBalanceFailure(error));
    }
}
function* getAllBalance() {
    yield takeEvery(GET_ALL_BALANCE, getAllBalanceSocket)
}

//get seprated balance by wallet type
function* getWalletsBalanceSocket(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/Wallet/GetAllBalancesTypeWise/' + payload.walletType, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.BizResponseObj.ReturnCode == 0 && responseFromSocket.statusCode == 200) {
                yield put(getWalletsBalanceSuccess(responseFromSocket.Wallets));
            } else if (responseFromSocket.BizResponseObj.ReturnCode == 1) {
                // console.log(responseFromSocket.BizResponseObj.ReturnMsg);
                yield put(getWalletsBalanceFailure(responseFromSocket.BizResponseObj.ReturnMsg));
            }
        }
    } catch (error) {
        // console.log(error);
        yield put(getWalletsBalanceFailure(error));
    }
}
function* getWalletsBalance() {
    yield takeEvery(GET_WALLETBALANCE, getWalletsBalanceSocket)
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getAllBalance),
        fork(getWalletsBalance),
    ]);
}