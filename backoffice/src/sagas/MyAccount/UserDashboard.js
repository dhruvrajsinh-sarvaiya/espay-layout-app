/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount User Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { USER_DASHBOARD, ADD_USER_DASHBOARD } from "Actions/types";
// import functions from action
import { getUserDataSuccess, getUserDataFailure, addUserDataSuccess, addUserDataFailure } from "Actions/MyAccount";

const usrDashData = {
    total_count: 6,
    active_count: 5,
    inactive_count: 1,
    delete_count: 5,
    new_count: 10
}

//Display User Data
function* getUserDataAPI() {
    try {
        yield put(getUserDataSuccess(usrDashData));
    } catch (error) {
        yield put(getUserDataFailure(error));
    }
}

//Function for Add User Data Configuration API
function* addUserDataAPI({ payload }) {
    try {
        if (Object.keys(payload).length > 0) {
            yield put(addUserDataSuccess(payload));
        } else {
            yield put(addUserDataFailure("Error"));
        }
    } catch (error) {
        yield put(addUserDataFailure(error));
    }
}

//Display User Data
function* getUserData() {
    yield takeEvery(USER_DASHBOARD, getUserDataAPI);
}

/* Add User Data */
export function* addUserData() {
    yield takeEvery(ADD_USER_DASHBOARD, addUserDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getUserData),
        fork(addUserData)
    ]);
}