/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Group Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {  GROUP_DASHBOARD } from "Actions/types";
// import functions from action
import { getGroupDataSuccess, getGroupDataFailure } from "Actions/MyAccount";

const grpDashData = {
    total_count : 6,
    active_count : 5,
    inactive_count : 1,
    delete_count : 5
}

//Display Group Data
function* getGroupDataAPI() {
    try {
        yield put(getGroupDataSuccess(grpDashData));
    } catch (error) {
        yield put(getGroupDataFailure(error));
    }
}

//Display Group Data
function* getGroupData() {
    yield takeEvery(GROUP_DASHBOARD, getGroupDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getGroupData)
    ]);
}