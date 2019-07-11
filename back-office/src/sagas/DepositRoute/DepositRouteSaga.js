/* 
    Developer : Nishant Vadgama
    Date : 31-01-2019
    File Comment : Deposit Report saga
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
    DEPOSITROUTELIST,
    INSERTUPDATEDEPOSITROUTE,
    REMOVEDEPOSITROUTE
} from 'Actions/types';
import {
    getDepositRouteListSuccess,
    getDepositRouteListFailure,
    insertUpdateDepositRouteSuccess,
    insertUpdateDepositRouteFailure,
    removeDepositRouteSuccess,
    removeDepositRouteFailure
} from 'Actions/DepositRoute';

//get route list from API
function* getDepositRouteListRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var URL = 'api/WalletControlPanel/GetDepositCounter/' + request.PageNo + '/' + request.PageSize + '?';
    if (request.hasOwnProperty("SerProId") && request.SerProId != "") {
        URL += '&SerProId=' + request.SerProId;
    }
    if (request.hasOwnProperty("WalletTypeID") && request.WalletTypeID != "") {
        URL += '&WalletTypeID=' + request.WalletTypeID;
    }
    const response = yield call(swaggerGetAPI, URL, request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(getDepositRouteListSuccess(response));
            } else {
                yield put(getDepositRouteListFailure(response));
            }
        }
    } catch (error) {
        yield put(getDepositRouteListFailure(error));
    }
}
/* get route list */
export function* getDepositRouteList() {
    yield takeEvery(DEPOSITROUTELIST, getDepositRouteListRequest);
}
/* insert & update routes request... */
function* insertUpdateDepositRouteRequest(payload) {
    var request = payload.request;
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/InsertUpdateDepositCounter', request, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(insertUpdateDepositRouteSuccess(response));
            } else {
                yield put(insertUpdateDepositRouteFailure(response));
            }
        }
    } catch (error) {
        yield put(insertUpdateDepositRouteFailure(error));
    }
}
/* insert & update deposit route...  */
export function* insertUpdateDepositRoute() {
    yield takeEvery(INSERTUPDATEDEPOSITROUTE, insertUpdateDepositRouteRequest);
}
/* remove routes request... */
function* removeDepositRouteRequest(payload) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    const response = yield call(swaggerPostAPI, 'api/WalletControlPanel/ChangeDepositCounterStatus/' + payload.routeId + '/9', payload, headers);
    try {
        // check response code
        if (lgnErrCode.includes(response.statusCode)) {
            //unauthorized or invalid token
            redirectToLogin()
        } else {
            if (response.ReturnCode == 0) {
                yield put(removeDepositRouteSuccess(response));
            } else {
                yield put(removeDepositRouteFailure(response));
            }
        }
    } catch (error) {
        yield put(removeDepositRouteFailure(error));
    }
}
/* remove deposit route...  */
export function* removeDepositRoute() {
    yield takeEvery(REMOVEDEPOSITROUTE, removeDepositRouteRequest);
}
/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(getDepositRouteList),
        fork(insertUpdateDepositRoute),
        fork(removeDepositRoute),
    ]);
}