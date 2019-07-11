/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Language Dashboard Sagas
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import { LANGUAGE_DASHBOARD } from "Actions/types";
// import functions from action
import { getLanguageDataSuccess, getLanguageDataFailure } from "Actions/MyAccount";

const lngDashData = {
    total_count: 6,
    active_count: 5,
    inactive_count: 1,
    delete_count: 5
}

//Display Language Data
function* getLanguageDataAPI() {
    try {
        yield put(getLanguageDataSuccess(lngDashData));
    } catch (error) {
        yield put(getLanguageDataFailure(error));
    }
}

//Display Language Data
function* getLanguageData() {
    yield takeEvery(LANGUAGE_DASHBOARD, getLanguageDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getLanguageData)
    ]);
}