/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Report Dashboard Sagas
*/
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { REPORT_DASHBOARD } from "Actions/types";
// import functions from action
import { getReportDataSuccess, getReportDataFailure } from "Actions/MyAccount";

const rptDashData = {
    total_user: 600,
    total_customer: 5000,
    total_role: 10,
    total_memberhip: 5,
    signup_report: 102
}

//Display Report Data
function* getReportDataAPI() {
    try {
        yield put(getReportDataSuccess(rptDashData));
    } catch (error) {
        yield put(getReportDataFailure(error));
    }
}

//Display Report Data
function* getReportData() {
    yield takeEvery(REPORT_DASHBOARD, getReportDataAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getReportData)
    ]);
}