/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Setting Dashboard Sagas
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import {  SETTING_DASHBOARD } from "Actions/types";
// import functions from action
import { getSettingDataSuccess, getSettingDataFailure } from "Actions/MyAccount";

const settingData = {
    general : {

    },
    two_fa : 1,
    signin_n_up_method : 1,
    language:'en',
    theme_mode:'dark',
    email_provider:'smtp'
}

//Display Setting Data
function* getSettingDataAPI() {
    try {
        yield put(getSettingDataSuccess(settingData));
    } catch (error) {
        yield put(getSettingDataFailure(error));
    }
}

//Display Setting Data
function* getSettingData() {
    yield takeEvery(SETTING_DASHBOARD, getSettingDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getSettingData)
    ]);
}