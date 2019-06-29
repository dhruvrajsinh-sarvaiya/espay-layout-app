/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated By:Saloni Rathod(05th APril 2019)
 * IP History List Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import {
    LOGIN_HISTORY_LIST
} from 'Actions/types';

import {
    loginHistoryListSuccess,
    loginHistoryListFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for Login History List API
function* loginHistoryListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var swaggerUrl = 'api/Manage/GetLoginHistory/' + payload.PageIndex + '/' + payload.Page_Size + '?';
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        swaggerUrl += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        swaggerUrl += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("IPAddress") && payload.IPAddress !== "") {
        swaggerUrl += '&IPAddress=' + payload.IPAddress;
    }
    if (payload.hasOwnProperty("Device") && payload.Device !== "") {
        swaggerUrl += '&Device=' + payload.Device;
    }
    if (payload.hasOwnProperty("Location") && payload.Location !== "") {
        swaggerUrl += '&Location=' + payload.Location;
    }
    const response = yield call(swaggerGetAPI, swaggerUrl, {}, headers);
    try {
        if (lgnErrCode.includes(response.statusCode)) {
            redirectToLogin();
        } else if (statusErrCode.includes(response.statusCode)) {
            var staticRes = staticResponse(response.statusCode);
            yield put(loginHistoryListFailure(staticRes));
        } else if (response.statusCode === 200) {
            yield put(loginHistoryListSuccess(response));
        } else {
            yield put(loginHistoryListFailure(response));
        }
    } catch (error) {
        yield put(loginHistoryListFailure(error));
    }
}

export function* getLoginHistory() {
    yield takeEvery(LOGIN_HISTORY_LIST, loginHistoryListAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getLoginHistory)
    ]);
}