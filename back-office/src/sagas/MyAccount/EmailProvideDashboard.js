/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Email Provider Dashboard Sagas
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import {  EMAIL_PROVIDER_DASHBOARD } from "Actions/types";
// import functions from action
import { getEmailProviderDataSuccess, getEmailProviderDataFailure } from "Actions/MyAccount";

const emailProDashData = {
    total_count : 6,
    active_count : 5,
    inactive_count : 1,
    delete_count : 5
}

//Display Email Provider Data
function* getEmailProviderDataAPI() {
    try {
        yield put(getEmailProviderDataSuccess(emailProDashData));
    } catch (error) {
        yield put(getEmailProviderDataFailure(error));
    }
}

//Display Email Provider Data
function* getEmailProviderData() {
    yield takeEvery(EMAIL_PROVIDER_DASHBOARD, getEmailProviderDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getEmailProviderData)
    ]);
}