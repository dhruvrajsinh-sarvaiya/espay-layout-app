/* 
    Developer : Kevin Ladani
    Date : 03-12-2018
    File Comment : MyAccount IPHistory Dashboard Sagas
*/
import { all, call, take, fork, put, takeEvery } from 'redux-saga/effects';
import { LIST_IPHISTORY_DASHBOARD } from "Actions/types";
// import functions from action
import { getIPHistoryDataSuccess, getIPHistoryDataFailure } from "Actions/MyAccount";
import AppConfig from 'Constants/AppConfig';
import { swaggerGetAPI } from 'Helpers/helpers';


//Display IPHistory Data
function* getIPHistoryDataAPI({payload}) {
    var swaggerUrl = 'api/Manage/GetIpHistory/'+payload.PageIndex+'/'+payload.Page_Size;
    var headers =  {'Authorization': AppConfig.authorizationToken}
    const response = yield call(swaggerGetAPI,swaggerUrl,{},headers);
    try {
        yield put(getIPHistoryDataSuccess(response));
    } catch (error) {
        yield put(getIPHistoryDataFailure(error));
    }
}

//Display IPHistory Data
function* getIPHistoryData() {
    yield takeEvery(LIST_IPHISTORY_DASHBOARD, getIPHistoryDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getIPHistoryData)
    ]);
}