/* 
    Developer : Nishant Vadgama
    Date : 09-01-2019
    File Comment : wallet sharing saga methods 
*/
import { all, call, fork, take, put, takeEvery } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';
const socketApiUrl = AppConfig.socketAPIUrl;
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();
//my wallets constant...
import {
    LISTALLWALLETS,
    LISTWALLETUSERS,
    ADDWALLETUSER,
    LISTWALLETREQUEST,
    ACCEPTREJECTWALLETREQUEST
} from 'Actions/types';
//my wallets methods...
import {
    getAllWalletsSuccess,
    getAllWalletsFailed,
    getWalletUserListSuccess,
    getWalletUserListFailed,
    addWalletUserSuccess,
    addWalletUserFailed,
    listWalletRequestsSuccess,
    listWalletRequestsFailed,
    walletRequestActionSuccess,
    walletRequestActionFailed
} from 'Actions/MyWallets';

//get all wallets request...
function* getAllWalletsRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var qs = (payload.request)? "?Coin=" + payload.request : "";
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOpnAdvanced/ListWalletNew' + qs, payload.request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getAllWalletsSuccess(responseFromSocket.Data));
            else
                yield put(getAllWalletsFailed(responseFromSocket));
        }
    } catch (error) {
        console.log(error);
        yield put(getAllWalletsFailed(error));
    }

}
// get all wallet list...
function* getAllWallets() {
    yield takeEvery(LISTALLWALLETS, getAllWalletsRequest)
}
//get all wallets user request...
function* getWalletUserListRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOpnAdvanced/ListUserWalletWise/' + payload.WalletId, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(getWalletUserListSuccess(responseFromSocket.Data));
            else
                yield put(getWalletUserListFailed(responseFromSocket));
        }
    } catch (error) {
        console.log(error);
        yield put(getWalletUserListFailed(error));
    }

}
// get wallet user list...
function* getWalletUserList() {
    yield takeEvery(LISTWALLETUSERS, getWalletUserListRequest)
}

//get all wallets user request...
function* addWalletUserRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOpnAdvanced/InsertUserWalletPendingRequest', payload.request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(addWalletUserSuccess(responseFromSocket));
            else
                yield put(addWalletUserFailed(responseFromSocket));
        }
    } catch (error) {
        console.log(error);
        yield put(addWalletUserFailed(error));
    }

}
// get wallet user list...
function* addWalletUser() {
    yield takeEvery(ADDWALLETUSER, addWalletUserRequest)
}

//get all wallets user request...
function* listWalletRequestsRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOpnAdvanced/ListUserWalletRequest', payload.request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(listWalletRequestsSuccess(responseFromSocket));
            else
                yield put(listWalletRequestsFailed(responseFromSocket));
        }
    } catch (error) {
        console.log(error);
        yield put(listWalletRequestsFailed(error));
    }

}

// list wallet request...
function* listWalletRequests() {
    yield takeEvery(LISTWALLETREQUEST, listWalletRequestsRequest)
}

//server request ...
function* walletRequestActionRequest(payload) {
    const request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOpnAdvanced/UpdateUserWalletPendingRequest/' + request.Status + '/' + request.RequestId, request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(walletRequestActionSuccess(responseFromSocket));
            else
                yield put(walletRequestActionFailed(responseFromSocket));
        }
    } catch (error) {
        console.log(error);
        yield put(walletRequestActionFailed(error));
    }

}
// accept reject wallet request...
function* walletRequestAction() {
    yield takeEvery(ACCEPTREJECTWALLETREQUEST, walletRequestActionRequest)
}

// rootsaga method binding...
export default function* rootSaga() {
    yield all([
        fork(getAllWallets),
        fork(getWalletUserList),
        fork(addWalletUser),
        fork(listWalletRequests),
        fork(walletRequestAction),
    ]);
}
