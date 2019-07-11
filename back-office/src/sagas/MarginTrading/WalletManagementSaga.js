/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : Margin Trading Wallet Management saga methods
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LIST_MARGIN_WALLETS,
} from 'Actions/types';
import {
    getMaringWalletListSuccess,
    getMaringWalletListFailure,
} from 'Actions/MarginTrading/MarginWallet';
const lgnErrCode = loginErrCode();
//server request ...
function* getMaringWalletListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MarginWalletControlPanel/ListMarginWallet/' + request.PageNo + "/" + request.PageSize + '?';
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("AccWalletId") && request.AccWalletId != "") {
        URL += '&AccWalletId=' + request.AccWalletId;
    }
    if (request.hasOwnProperty("UserId") && request.UserId !== "") {
        URL += '&UserId=' + request.UserId;
    }
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId !== "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("WalletId") && request.WalletId !== "") {
        URL += '&AccWalletId=' + request.WalletId;
    }
    if (request.hasOwnProperty("WalletUsageType") && request.WalletUsageType !== "") {
        URL += '&WalletUsageType=' + request.WalletUsageType;
    }
    const responseFromSocket = yield call(swaggerGetAPI, URL, request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getMaringWalletListSuccess(responseFromSocket));
            else
                yield put(getMaringWalletListFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(getMaringWalletListFailure(error));
    }
}
// get a list of marging wallets...
function* getMaringWalletList() {
    yield takeEvery(LIST_MARGIN_WALLETS, getMaringWalletListRequest)
}
// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getMaringWalletList),
    ]);
}
