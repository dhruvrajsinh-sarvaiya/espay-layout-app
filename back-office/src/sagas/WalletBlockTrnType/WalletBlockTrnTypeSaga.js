/* 
    Developer : Nishant Vadgama
    Date : 19-12-2018
    File Comment :  wallet block trn type methods 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import {
    swaggerPostAPI,
    swaggerGetAPI,
    redirectToLogin,
    loginErrCode,
} from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
import AppConfig from 'Constants/AppConfig';
import {
    GETWALLETBLOCKTRNLIST,
    CHANGEWALLETBLOCKTRNSTATUS,
    UPDATEWALLETBLOCKTRN
} from 'Actions/types';
import {
    getWalletBlockTrnListSuccess,
    getWalletBlockTrnListFailure,
    changeWalletBlockTrnStatusSuccess,
    changeWalletBlockTrnStatusFailure,
    insertUpdateWalletBlockTrnSuccess,
    insertUpdateWalletBlockTrnFailure
} from 'Actions/WalletBlockTrnType';

//get wallet block trn list
function* getWalletBlockTrnListRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerGetAPI, 'api/WalletControlPanel/ListUserWalletBlockTrnType', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(getWalletBlockTrnListSuccess(response));
            } else {
                yield put(getWalletBlockTrnListFailure(response));
            }
        }
    } catch (error) {
        yield put(getWalletBlockTrnListFailure(error));
    }
}
/* get wallet block trn list */
export function* getWalletBlockTrnList() {
    yield takeEvery(GETWALLETBLOCKTRNLIST, getWalletBlockTrnListRequest);
}
//change status request
function* changeWalletBlockTrnStatusRequest(payload) {
    const request = payload.payload
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/ChangeUserWalletBlockTrnTypeStatus/' + request.Id + '/' + request.Status, payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(changeWalletBlockTrnStatusSuccess(response));
            } else {
                yield put(changeWalletBlockTrnStatusFailure(response));
            }
        }
    } catch (error) {
        yield put(changeWalletBlockTrnStatusFailure(error));
    }
}
/* change status */
export function* changeWalletBlockTrnStatus() {
    yield takeEvery(CHANGEWALLETBLOCKTRNSTATUS, changeWalletBlockTrnStatusRequest);
}
/* Insert & Update wallet block trn type */
function* insertUpdateWalletBlockTrnRequest(payload) {
    const request = payload.payload
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/InsertUpdateUserWalletBlockTrnType', request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(insertUpdateWalletBlockTrnSuccess(response));
            } else {
                yield put(insertUpdateWalletBlockTrnFailure(response));
            }
        }
    } catch (error) {
        yield put(insertUpdateWalletBlockTrnFailure(error));
    }
}
export function* insertUpdateWalletBlockTrn() {
    yield takeEvery(UPDATEWALLETBLOCKTRN, insertUpdateWalletBlockTrnRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getWalletBlockTrnList),
        fork(changeWalletBlockTrnStatus),
        fork(insertUpdateWalletBlockTrn),
    ]);
}