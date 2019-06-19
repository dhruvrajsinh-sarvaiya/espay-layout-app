/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Role Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {  ROLE_DASHBOARD } from "Actions/types";
// import functions from action
import { getRoleDataSuccess, getRoleDataFailure } from "Actions/MyAccount";

const roleDashData = {
    total_count : 6,
    active_count : 5,
    inactive_count : 1,
    delete_count : 5
}

//Display Role Data
function* getRoleDataAPI() {
    try {
        yield put(getRoleDataSuccess(roleDashData));
    } catch (error) {
        yield put(getRoleDataFailure(error));
    }
}

//Display Role Data
function* getRoleData() {
    yield takeEvery(ROLE_DASHBOARD, getRoleDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getRoleData)
    ]);
}