/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Membership Level Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {  MEMBERSHIP_LEVEL_DASHBOARD } from "Actions/types";
// import functions from action
import { getMembershipLevelDataSuccess, getMembershipLevelDataFailure } from "Actions/MyAccount";

const memLvlDashData = {
    total_count : 6,
    active_count : 5,
    inactive_count : 1,
    delete_count : 5,
    new_count : 10
}

//Display Membership Level Data
function* getMembershipLevelDataAPI() {
    try {
        yield put(getMembershipLevelDataSuccess(memLvlDashData));
    } catch (error) {
        yield put(getMembershipLevelDataFailure(error));
    }
}

//Display Membership Level Data
function* getMembershipLevelData() {
    yield takeEvery(MEMBERSHIP_LEVEL_DASHBOARD, getMembershipLevelDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getMembershipLevelData)
    ]);
}