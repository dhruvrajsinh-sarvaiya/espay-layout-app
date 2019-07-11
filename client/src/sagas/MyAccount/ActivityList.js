/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Updated by : Saloni Rathod(19th March 2019)
 * Activity List Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//Action Types..
import {
    ACTIVITY_LIST
} from 'Actions/types';

//Action methods..
import {
    activityListSuccess,
    activityListFailure
} from 'Actions/MyAccount';

import AppConfig from 'Constants/AppConfig';
//Get function form helper for Swagger API Call
import { swaggerPostAPI } from 'Helpers/helpers';


//Function for Activity List Added by Saloni Rathod 19/03/2019
function* activityListAPI({ payload }) {
    var headers = { 'Authorization': AppConfig.authorizationToken }
    var swaggerUrl = 'api/BackOfficeActivityLog/GetActivityLogHistoryByUserId?' + 'pageIndex=' + payload.pageIndex + '&pageSize=' + payload.pageSize;
    if (payload.hasOwnProperty("FromDate") && payload.FromDate !== "") {
        swaggerUrl += '&FromDate=' + payload.FromDate;
    }
    if (payload.hasOwnProperty("ToDate") && payload.ToDate !== "") {
        swaggerUrl += '&ToDate=' + payload.ToDate;
    }
    if (payload.hasOwnProperty("Device") && payload.Device !== "") {
        swaggerUrl += '&Device=' + payload.Device;
    }
    if (payload.hasOwnProperty("Location") && payload.Location !== "") {
        swaggerUrl += '&Location=' + payload.Location;
    }
    if (payload.hasOwnProperty("Mode") && payload.Mode !== "") {
        swaggerUrl += '&Mode=' + payload.Mode;
    }
    const response = yield call(swaggerPostAPI, swaggerUrl, {}, headers);
    try {
        if (response.ReturnCode === 0) {
            yield put(activityListSuccess(response));
        } else {
            yield put(activityListFailure(response));
        }
    } catch (error) {
        yield put(activityListFailure(error));
    }
}

/* Create Sagas method for activityList */
export function* activityListSagas() {
    yield takeEvery(ACTIVITY_LIST, activityListAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(activityListSagas)
    ]);
}
