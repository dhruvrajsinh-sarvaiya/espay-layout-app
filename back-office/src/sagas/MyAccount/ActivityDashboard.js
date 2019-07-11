/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount Activity Dashboard Saga
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import { ACTIVITY_DASHBOARD } from "Actions/types";
// import functions from action
import { getActivityDataSuccess, getActivityDataFailure } from "Actions/MyAccount";

const activityDashboardData = {
    loginHistory_count: 12,
    ipHistory_count: 10,
}

//Display Activity Data
function* getActivityDataAPI() {
    try {
        yield put(getActivityDataSuccess(activityDashboardData));
    } catch (error) {
        yield put(getActivityDataFailure(error));
    }
}

//Display Activity Data
function* getActivityData() {
    yield takeEvery(ACTIVITY_DASHBOARD, getActivityDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getActivityData)
    ]);
}