/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Admin Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { ADMIN_DASHBOARD, ADD_ADMIN_DASHBOARD } from "Actions/types";
// import functions from action
import { getAdminDataSuccess, getAdminDataFailure, addAdminDataSuccess, addAdminDataFailure } from "Actions/MyAccount";

const adminDashData = {
    total_count: 6,
    active_count: 5,
    inactive_count: 1,
    delete_count: 5,
    new_count: 10
}

//Display Admin Data
function* getAdminDataAPI() {
    try {
        yield put(getAdminDataSuccess(adminDashData));
    } catch (error) {
        yield put(getAdminDataFailure(error));
    }
}

//Function for Add Admin Data Configuration API
function* addAdminDataAPI({ payload }) {
    try {
        if (Object.keys(payload).length > 0) {
            yield put(addAdminDataSuccess(payload));
        } else {
            yield put(addAdminDataFailure("Error"));
        }
    } catch (error) {
        yield put(addAdminDataFailure(error));
    }
}

//Display Admin Data
function* getAdminData() {
    yield takeEvery(ADMIN_DASHBOARD, getAdminDataAPI);
}

/* Add Admin Data */
export function* addAdminData() {
    yield takeEvery(ADD_ADMIN_DASHBOARD, addAdminDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getAdminData),
        fork(addAdminData)
    ]);
}