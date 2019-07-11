/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated by:saloni Rathod(05th April 2019)
 * IP History List Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { IP_HISTORY_LIST } from 'Actions/types';

import {
    ipHistoryListSuccess,
    ipHistoryListFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
import {  swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();


//Function for IP History List API
function* ipHistoryListAPI({ payload }) {
    var swaggerUrl = 'api/Manage/GetIpHistory/' + payload.PageIndex + '/' + payload.Page_Size + '?';
    var headers = { 'Authorization': AppConfig.authorizationToken }
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        swaggerUrl += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        swaggerUrl += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("IPAddress") && payload.IPAddress !== "") {
        swaggerUrl += '&IPAddress=' + payload.IPAddress;
    }

    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(ipHistoryListFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(ipHistoryListSuccess(response));
        } else {
            yield put(ipHistoryListFailure(response));
        }
    } catch (error) {
        yield put(ipHistoryListFailure(error));
    }
}

export function* getIPHistory() {
    yield takeEvery(IP_HISTORY_LIST, ipHistoryListAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getIPHistory)
    ]);
}