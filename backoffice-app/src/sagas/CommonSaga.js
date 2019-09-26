import { put, takeLatest, call, select, fork, all } from 'redux-saga/effects'
import { Method } from '../controllers/Methods';
import {
    FETCH_BALANCE_SUCCESS,
    FETCH_BALANCE_FAILURE,
    FETCH_BALANCE,
    GET_AD_WALLETS,
    GET_AD_BALANCE,
    GET_DEFAULT_ADD,
    FetchGenerateAddress,
    GenerateAddressSuccess,
    GenerateAddressFailure,
    GET_FEEANDLIMIT
} from '../actions/ActionTypes';
import { userAccessToken } from '../selector';
import {
    getWalletsSuccess, getWalletsFailure, getDefaultAddressSuccess, getDefaultAddressFailure,
    getFeeAndLimitsSuccess, getFeeAndLimitsFailure, getBalanceSuccess, getBalanceFailure
} from '../actions/CommonActions';
import { swaggerGetAPI } from '../api/helper';

//Call Get Balance API
function* callCoinList() {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        const data = yield call(swaggerGetAPI, Method.GetAllServiceConfiguration, {}, headers);
        //if Response Success then put data
        yield put({ type: FETCH_BALANCE_SUCCESS, data })
    } catch (e) {
        //if Response Failure then put Error
        yield put({ type: FETCH_BALANCE_FAILURE, e })
    }
}

function* getWalletsSocket(action) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetWalletByType + '/' + action.walletsRequest.Coin, action.walletsRequest, headers);
        // send orders to state reducer
        yield put(getWalletsSuccess(responseFromSocket));
    } catch (error) {
        yield put(getWalletsFailure(error));
    }
}

/* GET WALLET BALANCE BY WALLET ID */
function* getBalanceSocket(payload) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetAllBalances + '/' + payload.allBalanceRequest.WalletId, payload.allBalanceRequest, headers);
        yield put(getBalanceSuccess(responseFromSocket));
    } catch (error) {
        yield put(getBalanceFailure(error));
    }
}

/* GET DEFAULT ADDRESS BY WALLET ID */
function* getDefaultAddressSocket(payload) {
    try {
        //to get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetDefaultWalletAddress + '/' + payload.walletDefaultAddRequest.AccWalletID, payload.walletDefaultAddRequest, headers);
        yield put(getDefaultAddressSuccess(responseFromSocket));
    } catch (error) {
        yield put(getDefaultAddressFailure(error));
    }
}

//For Generate Address API Call
function* CallGenerateAddress(action) {
    try {
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        const data = yield call(swaggerGetAPI, Method.GetWhitelistedBeneficiaries + '/' + action.AccWalletID, { AccWalletID: action.AccWalletID }, headers);
        //if Response Success then put data
        yield put({ type: GenerateAddressSuccess, data })
    } catch (e) {
        //if Response Failure then put Error
        yield put({ type: GenerateAddressFailure, e })
    }
}
//------------

/* GET WALLET FEE & LIMITS */
function* getFeeAndLimitsSocket(payload) {
    try {
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        const responseFromSocket = yield call(swaggerGetAPI, Method.GetServiceLimitChargeValue + '/' + payload.feeLimitRequest.TrnType + '/' + payload.feeLimitRequest.CoinName, payload.feeLimitRequest, headers);
        yield put(getFeeAndLimitsSuccess(responseFromSocket));
    } catch (error) {
        yield put(getFeeAndLimitsFailure(error));
    }
}

//Call Get Balance API based on Fetch Balance Action
export function* callCoinListMain() {
    yield takeLatest(FETCH_BALANCE, callCoinList)
}

// Call get Wallet List Data
export function* getWalletsSocketMain() {
    yield takeLatest(GET_AD_WALLETS, getWalletsSocket)
}

//Call to Get All Blance of selected Wallet
export function* getBalanceSocketMain() {
    yield takeLatest(GET_AD_BALANCE, getBalanceSocket)
}

//Call to Get Default Wallet Address
export function* getDefaultAddressSocketMain() {
    yield takeLatest(GET_DEFAULT_ADD, getDefaultAddressSocket)
}

//For White Listed Beneficiary
export function* CallGenerateAddressMain() {
    yield takeLatest(FetchGenerateAddress, CallGenerateAddress)
}

//For get Fees and Limits in Withdraw Request
export function* getFeeAndLimitsSocketMain() {
    yield takeLatest(GET_FEEANDLIMIT, getFeeAndLimitsSocket)
}

/* Export methods to rootSagas */
function* CommonSaga() {
    yield all([
        fork(callCoinListMain),
        fork(getWalletsSocketMain),
        fork(getBalanceSocketMain),
        fork(getDefaultAddressSocketMain),
        fork(CallGenerateAddressMain),
        fork(getFeeAndLimitsSocketMain),
    ]);
}

export default CommonSaga;
