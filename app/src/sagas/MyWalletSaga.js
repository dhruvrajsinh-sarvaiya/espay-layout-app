import { all, call, fork, select, put, takeLatest } from 'redux-saga/effects';

//my wallets constant...
import {
    LISTALLWALLETS,
    LISTWALLETUSERS,
    ADDWALLETUSER,
    ACCEPTREJECTWALLETREQUEST,
    LIST_USER_WALLET_REQUEST
} from '../actions/ActionTypes';

//my wallets methods...
import {
    getAllWalletsSuccess,
    getAllWalletsFailed,
    getWalletUserListSuccess,
    getWalletUserListFailed,
    addWalletUserSuccess,
    addWalletUserFailed,
    walletRequestActionSuccess,
    walletRequestActionFailed,
    getListUserWalletRequestSuccess,
    getListUserWalletRequestFailed
} from '../actions/Wallet/MyWalletAction';

import { swaggerGetAPI, swaggerPostAPI, queryBuilder, } from '../api/helper';
import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';

// Generator for Wallet Request
function* getAllWalletsRequest(payload) {
    try {
        const request = payload.request;

        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // Create request
        let req = {};
        if (request) {
            // Coin is not undefined
            if (request.coin !== undefined) {
                req = {
                    ...req,
                    Coin: request.coin
                }
            }
        }

        // To call All Wallet Request api
        const response = yield call(swaggerGetAPI, Method.ListWalletNew + queryBuilder(req), request, headers);

        // To set Wallet Request success response to reducer
        yield put(getAllWalletsSuccess(response));
    } catch (error) {
        // To set Wallet Request failure response to reducer
        yield put(getAllWalletsFailed(error));
    }
}

// Generator for Wallet User List Request
function* getWalletUserListRequest(payload) {
    try {
        // Create requestUrl
        var swaggerUrl = Method.ListUserWalletWise + '/' + payload.WalletId;
        
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }
        
        // To call Wallet User List Request api
        const response = yield call(swaggerGetAPI, swaggerUrl, payload, headers);

        // To set Wallet User list success response to reducer
        yield put(getWalletUserListSuccess(response));
    } catch (error) {
        // To set Wallet User list failure response to reducer
        yield put(getWalletUserListFailed(error));
    }

}

// Generator for Add Wallet User Request
function* addWalletUserRequest(payload) {
    try {
        // Create requestUrl
        var swaggerUrl = Method.InsertUserWalletPendingRequest;
        
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Add Wallet User Request api
        const response = yield call(swaggerPostAPI, swaggerUrl, payload.request, headers);

        // To set Add Wallet User success response to reducer
        yield put(addWalletUserSuccess(response));
    } catch (error) {
        // To set Add Wallet User failure response to reducer
        yield put(addWalletUserFailed(error));
    }

}

// Generator for Wallet Request Action
function* walletRequestActionRequest(payload) {
    try {
        const request = payload.request;

        // Create requestUrl
        var swaggerUrl = Method.UpdateUserWalletPendingRequest + '/' + request.Status + '/' + request.RequestId;
        
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call Wallet Request Action api
        const response = yield call(swaggerPostAPI, swaggerUrl, {}, headers);

        // To set Wallet Request Action success response to reducer
        yield put(walletRequestActionSuccess(response));
    } catch (error) {
        // To set Wallet Request Action failure response to reducer
        yield put(walletRequestActionFailed(error));
    }
}

// Generator for User Wallet Request
function* ListUserWalletRequest() {
    try {
        // Create requestUrl
        var swaggerUrl = Method.ListUserWalletRequest;
        
        // To get tokenID of currently logged in user.
        let tokenID = yield select(userAccessToken);
        var headers = { 'Authorization': tokenID }

        // To call User Wallet List Request api
        const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);

        // To set User Wallet Request success response to reducer
        yield put(getListUserWalletRequestSuccess(response));
    } catch (error) {
        // To set User Wallet Request failure response to reducer
        yield put(getListUserWalletRequestFailed(error));
    }
}

// get all wallet list...
function* getAllWallets() {
    yield takeLatest(LISTALLWALLETS, getAllWalletsRequest)
}

// get wallet user list...
function* getWalletUserList() {
    yield takeLatest(LISTWALLETUSERS, getWalletUserListRequest)
}

// get wallet user list...
function* addWalletUser() {
    yield takeLatest(ADDWALLETUSER, addWalletUserRequest)
}

// accept reject wallet request...
function* walletRequestAction() {
    yield takeLatest(ACCEPTREJECTWALLETREQUEST, walletRequestActionRequest)
}

// Get List User Wallet
function* getListUserWallet() {
    yield takeLatest(LIST_USER_WALLET_REQUEST, ListUserWalletRequest)
}

export default function* rootSaga() {
    yield all([
        // To register getAllWallets method
        fork(getAllWallets),
        // To register getWalletUserList method
        fork(getWalletUserList),
        // To register addWalletUser method
        fork(addWalletUser),
        // To register walletRequestAction method
        fork(walletRequestAction),
        // To register getListUserWallet method
        fork(getListUserWallet),
    ]);
}
