/* 
    Developer : Nishant Vadgama
    Date : 21-09-2018
    File comment : Token Staking saga methods list
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
import AppConfig from 'Constants/AppConfig';
// import types for dispatch puropse
import {
    GETWALLETTYPELIST,
    GET_SLABLIST,
    PRECONFIRMATIONDETAILS,
    STAKREQUEST,
} from 'Actions/types';
// import functions from action
import {
    getWalletTypeListSuccess,
    getWalletTypeListFailure,
    getSlabListSuccess,
    getSlabListFailure,
    getPreConfirmationDetailsSuccess,
    getPreConfirmationDetailsFailure,
    postStackRequestSuccess,
    postStackRequestFailure
} from 'Actions/TokenStaking';

// get plan list details
function* getSlabListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletOperations/GetStackingPolicyDetail/' + request.StatkingTypeID + '/' + request.CurrencyTypeID, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0) {
                yield put(getSlabListSuccess(responseFromSocket));
            } else {
                yield put(getSlabListFailure(responseFromSocket));
            }
        }
    } catch (error) {
        yield put(getSlabListFailure(error));
    }
}
// get plan list 
function* getSlabList() {
    yield takeEvery(GET_SLABLIST, getSlabListRequest)
}
// pre confirmation details request...
function* getPreConfirmationRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOperations/GetPreStackingConfirmationData', payload.request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0) {
                yield put(getPreConfirmationDetailsSuccess(responseFromSocket));
            } else {
                yield put(getPreConfirmationDetailsFailure(responseFromSocket));
            }
        }
    } catch (error) {
        yield put(getPreConfirmationDetailsFailure(error));
    }
}
// get pre confirmation details...
function* getPreConfirmationDetails() {
    yield takeEvery(PRECONFIRMATIONDETAILS, getPreConfirmationRequest)
}
// get wallet type list ...
function* getWalletTypeListRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerGetAPI, 'api/WalletConfiguration/ListAllWalletTypeMaster', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0 && responseFromSocket.hasOwnProperty('walletTypeMasters'))
                yield put(getWalletTypeListSuccess(responseFromSocket.walletTypeMasters));
            else
                yield put(getWalletTypeListFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(getWalletTypeListFailure(error));
    }
}
// get wallet type list...
function* getWalletTypeList() {
    yield takeEvery(GETWALLETTYPELIST, getWalletTypeListRequest)
}
// staking request confirmation...
function* postStackRequestServer(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const responseFromSocket = yield call(swaggerPostAPI, 'api/WalletOperations/UserStackingPolicyRequest', payload.request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(responseFromSocket.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (responseFromSocket.ReturnCode == 0)
                yield put(postStackRequestSuccess(responseFromSocket));
            else
                yield put(postStackRequestFailure(responseFromSocket));
        }
    } catch (error) {
        yield put(postStackRequestFailure(error));
    }
}
//post staking final request...
function* postStackRequest() {
    yield takeEvery(STAKREQUEST, postStackRequestServer)
}
// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getWalletTypeList),
        fork(getSlabList),
        fork(getPreConfirmationDetails),
        fork(postStackRequest),
    ]);
}