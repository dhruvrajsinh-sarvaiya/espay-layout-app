/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount PhoneNumber Dashboard Saga
*/
import { all, fork, put, takeEvery } from "redux-saga/effects";
import { PHONE_NUMBER_DASHBOARD } from "Actions/types";
// import functions from action
import { getPhoneNumberDataSuccess, getPhoneNumberDataFailure } from "Actions/MyAccount";

const phoneDashboardData = {
    verify_number: 2,
    unVerify_number: 10,
}

//Display PhoneNumber Data
function* getPhoneNumberDataAPI() {
    try {
        yield put(getPhoneNumberDataSuccess(phoneDashboardData));
    } catch (error) {
        yield put(getPhoneNumberDataFailure(error));
    }
}

//Display PhoneNumber Data
function* getPhoneNumberData() {
    yield takeEvery(PHONE_NUMBER_DASHBOARD, getPhoneNumberDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getPhoneNumberData)
    ]);
}