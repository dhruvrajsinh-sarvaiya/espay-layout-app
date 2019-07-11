/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount Group Dashboard Saga
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import { GROUP_INFO_DASHBOARD } from "Actions/types";
// import functions from action
import { getGroupInfoDataSuccess, getGroupInfoDataFailure } from "Actions/MyAccount";

const grpDashData = {
    total_count: 10,
    active_count: 6,
    inactive_count: 4,
    // delete_count: 5
}

//Display Group Data
function* getGroupInfoDataAPI() {
    try {
        yield put(getGroupInfoDataSuccess(grpDashData));
    } catch (error) {
        yield put(getGroupInfoDataFailure(error));
    }
}

//Display Group Data
function* getGroupInfoData() {
    yield takeEvery(GROUP_INFO_DASHBOARD, getGroupInfoDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getGroupInfoData)
    ]);
}