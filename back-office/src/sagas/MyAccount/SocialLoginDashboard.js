/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Social Login Dashboard Sagas
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import {  SOCIAL_LOGIN_DASHBOARD } from "Actions/types";
// import functions from action
import { getSocialLoginDataSuccess, getSocialLoginDataFailure } from "Actions/MyAccount";

const slngDashData = {
    total_count : 6,
    active_count : 5,
    inactive_count : 1,
    delete_count : 5
}

//Display Social Login Data
function* getSocialLoginDataAPI() {
    try {
        yield put(getSocialLoginDataSuccess(slngDashData));
    } catch (error) {
        yield put(getSocialLoginDataFailure(error));
    }
}

//Display Social Login Data
function* getSocialLoginData() {
    yield takeEvery(SOCIAL_LOGIN_DASHBOARD, getSocialLoginDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getSocialLoginData)
    ]);
}