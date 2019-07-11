/* 
    Developer : Kevin Ladani
    Date : 03-12-2018
    File Comment : MyAccount Login History Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { LIST_LOGINHISTORY_DASHBOARD } from "Actions/types";
// import functions from action
import { getLoginHistoryDataSuccess, getLoginHistoryDataFailure } from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI } from 'Helpers/helpers';

//Display Login History Data
function* getLoginHistoryDataAPI({ payload }) {
    var swaggerUrl = 'api/Manage/GetLoginHistory/'+payload.PageIndex+'/'+payload.Page_Size;
    var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerGetAPI,swaggerUrl,{},headers);
    try {
       if (response.statusCode === 200) {
            yield put(getLoginHistoryDataSuccess(response));
        } else {
            yield put(getLoginHistoryDataFailure(response));
        }
    } catch (error) {
        yield put(getLoginHistoryDataFailure(error));
    }
}

//Display Login History Data
function* getLoginHistoryData() {
    yield takeEvery(LIST_LOGINHISTORY_DASHBOARD, getLoginHistoryDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getLoginHistoryData)
    ]);
}