/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount 2FA Authentication Dashboard Sagas
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import {  TWO_FA_DASHBOARD } from "Actions/types";
// import functions from action
import { get2FaAuthDataSuccess, get2FaAuthDataFailure } from "Actions/MyAccount";

const twoFADashData = {
    total_count : 6,
    active_count : 5,
    inactive_count : 1,
    delete_count : 5
}

//Display 2FA Authentication Data
function* get2FaAuthDataAPI() {
    try {
        yield put(get2FaAuthDataSuccess(twoFADashData));
    } catch (error) {
        yield put(get2FaAuthDataFailure(error));
    }
}

//Display 2FA Authentication Data
function* get2FaAuthData() {
    yield takeEvery(TWO_FA_DASHBOARD, get2FaAuthDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(get2FaAuthData)
    ]);
}