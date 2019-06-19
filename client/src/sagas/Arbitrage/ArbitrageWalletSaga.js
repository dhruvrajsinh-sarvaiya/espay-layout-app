/* 
    Developer : vishva shah
    Date : 5-06-2019
    File Comment : Arbitrage wallet list saga methods
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerGetAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
import {
    LIST_ARBITRAGE_WALLETS,
    CREATE_ARBITRAGE_WALLETS,
    ADD_LEVERAGE_PRECONFIRMATION,
    ADD_ARBITRAGE_LEVERAGE,
    LIST_ARBITRAGE_CURRENCY,
    ARBITRAGE_ADD_WALLET_BALANCE
} from 'Actions/types';
import {
    getArbitrageWalletListSuccess,
    getArbitrageWalletListFailure,
    createArbitrageWalletSuccess,
    createArbitrageWalletFailure,
    addLeveragePreconfirmationSuccess,
    addLeveragePreconfirmationFailure,
    confirmArbitrageLeverageSuccess,
    confirmArbitrageLeverageFailure,
    getArbitrageCurrencyListSuccess,
    getArbitrageCurrencyListFailure,
    addAtbitrageBalanceSuccess,
    addAtbitrageBalanceFailure
} from 'Actions/Arbitrage';
//server request ...
function* ArbitrageCurrencyRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/ArbitrageWallet/ListCurrency', payload, headers);
    try {
        if (responseFromSocket.ReturnCode == 0)
            yield put(getArbitrageCurrencyListSuccess(responseFromSocket));
        else
            yield put(getArbitrageCurrencyListFailure(responseFromSocket));
    } catch (error) {
        yield put(getArbitrageCurrencyListFailure(error));
    }
}
//server request ...
function* getArbitrageWalletListRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/ArbitrageWallet/ListWalletMaster?';
    if (request.hasOwnProperty("Status") && request.Status != "") {
        URL += '&Status=' + request.Status;
    }
    if (request.hasOwnProperty("WalletTypeId") && request.WalletTypeId != "") {
        URL += '&WalletTypeId=' + request.WalletTypeId;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        if (response.ReturnCode == 0)
            yield put(getArbitrageWalletListSuccess(response));
        else
            yield put(getArbitrageWalletListFailure(response));

    } catch (error) {
        yield put(getArbitrageWalletListFailure(error));
    }
}
//server request ...
function* createArbitrageWalletRequest(payload) {
    var request = payload.request
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/ArbitrageWallet/CreateArbitrageWallet/' + request.CoinName, {}, headers);
    try {
        if (responseFromSocket.ReturnCode == 0)
            yield put(createArbitrageWalletSuccess(responseFromSocket));
        else
            yield put(createArbitrageWalletFailure(responseFromSocket));
    } catch (error) {
        yield put(createArbitrageWalletFailure(error));
    }
}
//server request ...
function* addLeveragePreconfirmationRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/MarginWallet/GetMarginPreConfirmationData/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletid + '?Leverage=' + request.LeveragePer, payload.WalletTypeId, headers);
    try {
        if (responseFromSocket.ReturnCode == 0)
            yield put(addLeveragePreconfirmationSuccess(responseFromSocket));
        else
            yield put(addLeveragePreconfirmationFailure(responseFromSocket));
    } catch (error) {
        yield put(addLeveragePreconfirmationFailure(error));
    }
}
//server request ...
function* confirmAddLeverageRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/MarginWallet/InsertMarginRequest/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletid + '?Leverage=' + request.LeveragePer, payload.WalletTypeId, headers);
    try {
        if (responseFromSocket.ReturnCode == 0)
            yield put(confirmArbitrageLeverageSuccess(responseFromSocket));
        else
            yield put(confirmArbitrageLeverageFailure(responseFromSocket));
    } catch (error) {
        yield put(confirmArbitrageLeverageFailure(error));
    }
}
//server request ...
function* addAtbitrageBalanceRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/ArbitrageWallet/ArbitrageFundTransafer', request, headers);
    try {
        if (responseFromSocket.ReturnCode === 0)
            yield put(addAtbitrageBalanceSuccess(responseFromSocket));
        else
            yield put(addAtbitrageBalanceFailure(responseFromSocket));
    } catch (error) {
        yield put(addAtbitrageBalanceFailure(error));
    }
}
// get a list of Arbitrage Currency...
function* ArbitragecurrencyList() {
    yield takeEvery(LIST_ARBITRAGE_CURRENCY, ArbitrageCurrencyRequest)
}
// get a list of Arbitrage wallets...
function* getArbitrageWalletList() {
    yield takeEvery(LIST_ARBITRAGE_WALLETS, getArbitrageWalletListRequest)
}
// create a arbitrage wallet ...
function* createArbitrageWallet() {
    yield takeEvery(CREATE_ARBITRAGE_WALLETS, createArbitrageWalletRequest)
}
/* add leverage with wallet */
function* addLeveragePreconfirmation() {
    yield takeEvery(ADD_LEVERAGE_PRECONFIRMATION, addLeveragePreconfirmationRequest)
}
/* confirm add leverage wallet  */
function* confirmArbitrageLeverage() {
    yield takeEvery(ADD_ARBITRAGE_LEVERAGE, confirmAddLeverageRequest)
}
/* add arbitrage wallet balance */
function* addAtbitrageBalance() {
    yield takeEvery(ARBITRAGE_ADD_WALLET_BALANCE, addAtbitrageBalanceRequest)
}
// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getArbitrageWalletList),
        fork(createArbitrageWallet),
        fork(addLeveragePreconfirmation),
        fork(confirmArbitrageLeverage),
        fork(ArbitragecurrencyList),
        fork(addAtbitrageBalance),
    ]);
}
