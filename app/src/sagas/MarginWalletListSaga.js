import { all, call, fork, put, takeLatest, select } from "redux-saga/effects";
import {
    GET_MARGIN_WALLET,
    ADD_LEVERAGE,
    ADD_LEVERAGE_CONFIRMATION,
    LEVERAGE_BASE_CURRENCY
} from "../actions/ActionTypes";

// import functions from action
import {
    getMarginWalletsSuccess,
    getMarginWalletsFailure,
    addLeverageWithWalletSuccess,
    addLeverageWithWalletFailure,
    confirmAddLeverageSuccess,
    confirmAddLeverageFailure,
    getLeverageBaseCurrencySuccess,
    getLeverageBaseCurrencyFailure
} from "../actions/Margin/MarginWalletListAction";

import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { swaggerGetAPI, swaggerPostAPI, } from '../api/helper';

function* getWalletsListData(action) {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Margin Wallet List api
        const response = yield call(swaggerGetAPI, Method.GetWalletByType + '/' + action.walletsRequest.Coin, action.walletsRequest, headers);
        
        // To set Margin Wallet list success response to reducer
        yield put(getMarginWalletsSuccess(response));
    } catch (error) {
        // To set Margin Wallet list failure response to reducer
        yield put(getMarginWalletsFailure(error));
    }
}


// For Add Lavarge Wallet Request
function* addLeverageWithWalletRequest(payload) {
    try {
        const request = payload.request;
        var swaggerUrl = Method.GetMarginPreConfirmationData + '/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletid + '?Leverage=' + request.Leverage;
        
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Add Leverage with Wallet Request List api
        const response = yield call(swaggerGetAPI, swaggerUrl, request, headers);

        // To set Add Leverage Wallet success response to reducer
        yield put(addLeverageWithWalletSuccess(response));
    } catch (error) {
        // To set Add Leverage Wallet failure response to reducer
        yield put(addLeverageWithWalletFailure(error));
    }
}

// For Confirm Add Levarge Request 
function* confirmAddLeverageRequest(payload) {
    try {
        const request = payload.request;
        var swaggerUrl = Method.InsertMarginRequest + '/' + request.WalletTypeId + '/' + request.Amount + '/' + request.AccWalletID + '?Leverage=' + request.Leverage;
        
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Confirm Leverage Request List api
        const response = yield call(swaggerPostAPI, swaggerUrl, request, headers);

        // To set Confirm Leverage Wallet success response to reducer
        yield put(confirmAddLeverageSuccess(response));
    } catch (error) {
        // To set Confirm Leverage Wallet failure response to reducer
        yield put(confirmAddLeverageFailure(error));
    }
}

// For Leverage Base Currency Request 
function* leverageBaseCurrencyRequest() {
    try {
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Leverage Base Currency Request List api
        const response = yield call(swaggerGetAPI, Method.ListLeverageBaseCurrency, {}, headers);

        // To set Leverage Base Currency success response to reducer
        yield put(getLeverageBaseCurrencySuccess(response));
    } catch (error) {
        // To set Leverage Base Currency failure response to reducer
        yield put(getLeverageBaseCurrencyFailure(error));
    }
}

// Call get Wallet List Data
export function* getWalletList() {
    yield takeLatest(GET_MARGIN_WALLET, getWalletsListData)
}

// For Add Levarge With Wallet
function* addLeverageWithWallet() {
    yield takeLatest(ADD_LEVERAGE, addLeverageWithWalletRequest)
}

// For Confirmation Addedd Leavege
function* confirmAddLeverage() {
    yield takeLatest(ADD_LEVERAGE_CONFIRMATION, confirmAddLeverageRequest)
}

// For Leverage Base Currency
function* getLeverageBaseCurrency() {
    yield takeLatest(LEVERAGE_BASE_CURRENCY, leverageBaseCurrencyRequest)
}

// link to root saga middleware
export default function* rootSaga() {
    yield all([
        // To register getWalletList method
        fork(getWalletList),
        // To register addLeverageWithWallet method
        fork(addLeverageWithWallet),
        // To register confirmAddLeverage method
        fork(confirmAddLeverage),
        // To register getLeverageBaseCurrency method
        fork(getLeverageBaseCurrency),
    ]);
}
