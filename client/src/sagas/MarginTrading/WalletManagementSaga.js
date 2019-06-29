/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : Margin Trading Wallet Management saga methods
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LIST_MARGIN_WALLETS,
    CREATE_MARGIN_WALLETS,
    ADD_LEVERAGE,
    ADD_LEVERAGE_CONFIRMATION,
    GET_LEVERAGE_BASE_CURRENCY,
    DELEVERAGE_PRECONFIRM,
    DELEVERAGE_CONFIRM
} from 'Actions/types';
import {
    getMaringWalletListSuccess,
    getMaringWalletListFailure,
    createMarginWalletSuccess,
    createMarginWalletFailure,
    addLeverageWithWalletSuccess,
    addLeverageWithWalletFailure,
    confirmAddLeverageSuccess,
    confirmAddLeverageFailure,
    getMarginCurrencySuccess,
    getMarginCurrencyFailure,
    getPreConfirmationsSuccess,
    getPreConfirmationsFailure,
    delavrageConfirmSuccess,
    delavrageConfirmFailure
} from 'Actions/MarginTrading';
const lgnErrCode = loginErrCode();
//server request ...
function* getMaringWalletListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/MarginWallet/ListMarginWalletMaster?';
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    if (request.hasOwnProperty("WalletUsageType") && request.WalletUsageType != "") {
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
                yield put(getMaringWalletListSuccess(responseFromSocket.Data));
            else
                yield put(getMaringWalletListFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(getMaringWalletListFailure(error));
    }
}
//server request ...
function* createMarginWalletRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/MarginWallet/CreateMarginWallet/' + payload.WalletTypeId, payload.WalletTypeId, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(createMarginWalletSuccess(responseFromSocket));
            else
                yield put(createMarginWalletFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(createMarginWalletFailure(error));
    }
}
//server request ...
function* addLeverageWithWalletRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/MarginWallet/GetMarginPreConfirmationData/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletid + '?Leverage=' + request.LeveragePer, payload.WalletTypeId, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(addLeverageWithWalletSuccess(responseFromSocket));
            else
                yield put(addLeverageWithWalletFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(addLeverageWithWalletFailure(error));
    }
}
//server request ...
function* confirmAddLeverageRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/MarginWallet/InsertMarginRequest/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletid + '?Leverage=' + request.LeveragePer, payload.WalletTypeId, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(confirmAddLeverageSuccess(responseFromSocket));
            else
                yield put(confirmAddLeverageFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(confirmAddLeverageFailure(error));
    }
}
// pre confirmation details request...
function* getPreConfirmationRequest(payload) {
    const request = payload.request
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/MarginWallet/MarginWithdrawPreConfirm?Currency=' + request, {}, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(getPreConfirmationsSuccess(response));
        } else {
            yield put(getPreConfirmationsFailure(response));
        }
    } catch (error) {
        yield put(getPreConfirmationsFailure(error));
    }
}

function* getConfirmationRequest(payload) {
    const request = payload.request
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/MarginWallet/WithdrawMigration?Currency=' + request, {}, headers);
    try {
        if (response.ReturnCode == 0) {
            yield put(delavrageConfirmSuccess(response));
        } else {
            yield put(delavrageConfirmFailure(response));
        }
    } catch (error) {
        yield put(delavrageConfirmFailure(error));
    }
}
// get pre confirmation details...
function* getPreConfirmationDetails() {
    yield takeEvery(DELEVERAGE_PRECONFIRM, getPreConfirmationRequest)
}
function* getConfirmationDetails() {
    yield takeEvery(DELEVERAGE_CONFIRM, getConfirmationRequest)
}
// get a list of marging wallets...
function* getMaringWalletList() {
    yield takeEvery(LIST_MARGIN_WALLETS, getMaringWalletListRequest)
}
// create a margin wallet ...
function* createMarginWallet() {
    yield takeEvery(CREATE_MARGIN_WALLETS, createMarginWalletRequest)
}
/* add leverage with wallet */
function* addLeverageWithWallet() {
    yield takeEvery(ADD_LEVERAGE, addLeverageWithWalletRequest)
}
/* confirm add leverage wallet  */
function* confirmAddLeverage() {
    yield takeEvery(ADD_LEVERAGE_CONFIRMATION, confirmAddLeverageRequest)
}
//added by parth andhariya
//list margin currency api
function* getMarginCurrencyApi(payload) {
    try {
        var headers = { 'Authorization': AppConfig.authorizationToken }
        const response = yield call(swaggerGetAPI, 'api/MarginWallet/ListLeverageBaseCurrency', {}, headers);
        if (response.ReturnCode === 0) {
            yield put(getMarginCurrencySuccess(response));
        } else {
            yield put(getMarginCurrencyFailure(response));
        }
    } catch (error) {
        yield put(getMarginCurrencyFailure(error));
    }
}
//added by parth andhariya
//list margin currency
function* getMarginCurrency() {
    yield takeEvery(GET_LEVERAGE_BASE_CURRENCY, getMarginCurrencyApi);
}
// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getMaringWalletList),
        fork(createMarginWallet),
        fork(addLeverageWithWallet),
        fork(confirmAddLeverage),
        fork(getMarginCurrency),
        fork(getPreConfirmationDetails),
        fork(getConfirmationDetails)
    ]);
}
